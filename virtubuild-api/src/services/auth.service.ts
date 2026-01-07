import { Repository, MoreThan } from 'typeorm';
import { DBDataSource } from '@/database';
import { User } from '@/database/entities';
import { cacheService } from './cache.service';
import { auditService } from './audit.service';
import { emailService } from './email.service';
import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = DBDataSource.getRepository(User);
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userRoleId?: number;
  }): Promise<{ user: User; verificationToken: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(userData.password);
    const verificationToken = randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const savedUser = await this.userRepository.save(user);

    await emailService.sendVerificationEmail(savedUser.email, verificationToken);

    await auditService.log({
      action: 'USER_REGISTERED',
      resource: 'User',
      resourceId: savedUser.id.toString(),
      userId: savedUser.id,
      details: `User registered with email: ${savedUser.email}`
    });

    return { user: savedUser, verificationToken };
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: MoreThan(new Date())
      }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    const updatedUser = await this.userRepository.save(user);

    await auditService.log({
      action: 'EMAIL_VERIFIED',
      resource: 'User',
      resourceId: updatedUser.id.toString(),
      userId: updatedUser.id,
      details: `Email verified for user: ${updatedUser.email}`
    });

    return updatedUser;
  }

  async login(email: string, password: string, ipAddress: string, userAgent: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
    requiresTwoFactor?: boolean;
  }> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new Error('Account is temporarily locked due to too many failed login attempts');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user);
      throw new Error('Invalid credentials');
    }

    if (!user.isEnabled) {
      throw new Error('Account is disabled');
    }

    if (!user.isEmailVerified) {
      throw new Error('Email not verified');
    }

    await this.resetFailedLoginAttempts(user);

    if (user.twoFactorEnabled) {
      await cacheService.setSession(user.id.toString(), {
        email: user.email,
        requiresTwoFactor: true,
        tempToken: randomBytes(32).toString('hex')
      }, 300);

      return {
        user,
        accessToken: '',
        refreshToken: '',
        requiresTwoFactor: true
      };
    }

    const tokens = await this.generateTokens(user);
    await this.updateLastLogin(user, ipAddress);

    await auditService.log({
      action: 'USER_LOGIN',
      resource: 'User',
      resourceId: user.id.toString(),
      userId: user.id,
      details: `User logged in from IP: ${ipAddress}`,
      ipAddress,
      userAgent
    });

    return {
      user,
      ...tokens
    };
  }

  async verifyTwoFactor(userId: string, token: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) }
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new Error('Two-factor authentication not enabled');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });

    if (!isValid) {
      throw new Error('Invalid two-factor authentication code');
    }

    const tokens = await this.generateTokens(user);

    await auditService.log({
      action: 'TWO_FACTOR_VERIFIED',
      resource: 'User',
      resourceId: user.id.toString(),
      userId: user.id,
      details: 'Two-factor authentication verified successfully'
    });

    return {
      user,
      ...tokens
    };
  }

  async setupTwoFactor(userId: string): Promise<{ secret: string; qrCodeUrl: string }> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const secret = authenticator.generateSecret();
    const qrCodeUrl = authenticator.keyuri(
      user.email,
      'VirtuBuild',
      secret
    );

    user.twoFactorSecret = secret;
    await this.userRepository.save(user);

    await auditService.log({
      action: 'TWO_FACTOR_SETUP',
      resource: 'User',
      resourceId: user.id.toString(),
      userId: user.id,
      details: 'Two-factor authentication setup initiated'
    });

    return { secret, qrCodeUrl };
  }

  async enableTwoFactor(userId: string, token: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) }
    });

    if (!user || !user.twoFactorSecret) {
      throw new Error('Two-factor setup not initiated');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });

    if (!isValid) {
      throw new Error('Invalid two-factor authentication code');
    }

    user.twoFactorEnabled = true;
    const updatedUser = await this.userRepository.save(user);

    await auditService.log({
      action: 'TWO_FACTOR_ENABLED',
      resource: 'User',
      resourceId: updatedUser.id.toString(),
      userId: updatedUser.id,
      details: 'Two-factor authentication enabled'
    });

    return updatedUser;
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenData = await cacheService.getRefreshToken(refreshToken);
    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: parseInt(tokenData.userId) }
    });

    if (!user || !user.isEnabled) {
      throw new Error('User not found or disabled');
    }

    await cacheService.invalidateRefreshToken(refreshToken);

    const newTokens = await this.generateTokens(user);

    await auditService.log({
      action: 'TOKEN_REFRESHED',
      resource: 'User',
      resourceId: user.id.toString(),
      userId: user.id,
      details: 'Access token refreshed'
    });

    return newTokens;
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    await cacheService.invalidateSession(userId);
    
    if (refreshToken) {
      await cacheService.invalidateRefreshToken(refreshToken);
    }

    await auditService.log({
      action: 'USER_LOGOUT',
      resource: 'User',
      resourceId: userId,
      userId: parseInt(userId),
      details: 'User logged out'
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      return;
    }

    const resetToken = randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepository.save(user);
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    await auditService.log({
      action: 'PASSWORD_RESET_REQUESTED',
      resource: 'User',
      resourceId: user.id.toString(),
      userId: user.id,
      details: `Password reset requested for email: ${email}`
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: token,
        passwordResetExpires: MoreThan(new Date())
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await argon2.hash(newPassword);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    const updatedUser = await this.userRepository.save(user);

    await cacheService.invalidateSession(updatedUser.id.toString());

    await auditService.log({
      action: 'PASSWORD_RESET',
      resource: 'User',
      resourceId: updatedUser.id.toString(),
      userId: updatedUser.id,
      details: 'Password reset successfully'
    });

    return updatedUser;
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = JWT.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          userRoleId: user.userRoleId
        }
      },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '15m' }
    );

    const refreshToken = randomBytes(32).toString('hex');
    await cacheService.setRefreshToken(refreshToken, user.id.toString(), 604800);

    return { accessToken, refreshToken };
  }

  private async handleFailedLogin(user: User): Promise<void> {
    user.failedLoginAttempts += 1;
    
    if (user.failedLoginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.userRepository.save(user);
  }

  private async resetFailedLoginAttempts(user: User): Promise<void> {
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
      await this.userRepository.save(user);
    }
  }

  private async updateLastLogin(user: User, ipAddress: string): Promise<void> {
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;
    await this.userRepository.save(user);
  }
}

export const authService = new AuthService();
