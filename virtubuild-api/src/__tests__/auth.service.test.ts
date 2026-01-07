import { AuthService } from '@/modules/auth/auth.service';
import { UsersService } from '@/modules/users/users.service';
import { userRolesRepository } from '@/database';
import { verifyPassword } from '@/utils';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

jest.mock('@/modules/users/users.service');
jest.mock('@/database');
jest.mock('@/utils');
jest.mock('jsonwebtoken');
jest.mock('@/configs');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockUserRolesRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    mockUsersService = authService.usersService as jest.Mocked<UsersService>;
    
    mockUserRolesRepository = {
      findOneBy: jest.fn()
    } as any;
    
    (userRolesRepository as any) = mockUserRolesRepository;
  });

  describe('signinAccount', () => {
    const mockUser = {
      id: 1,
      email: 'student@example.com',
      password: 'hashedpassword',
      firstName: 'John',
      lastName: 'Doe',
      userRoleId: 2
    };

    const mockRole = {
      id: 2,
      name: 'Student'
    };

    it('should return auth token for valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser as any);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      mockUserRolesRepository.findOneBy.mockResolvedValue(mockRole);
      (JWT.sign as jest.Mock).mockReturnValue('mock-jwt-token');
      (SETTINGS as any).APP_JWT_SECRET_KEY = 'secret';

      const credentials = {
        email: 'student@example.com',
        password: 'Password123!'
      };

      const result = await authService.signinAccount(credentials);

      expect(result).toEqual({
        authToken: 'mock-jwt-token'
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(verifyPassword).toHaveBeenCalledWith(credentials.password, mockUser.password);
      expect(JWT.sign).toHaveBeenCalledWith(
        { user: { ...mockUser, password: undefined, roleName: 'Student' } },
        'secret',
        { expiresIn: '1h' }
      );
    });

    it('should return null for invalid password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser as any);
      (verifyPassword as jest.Mock).mockResolvedValue(false);

      const credentials = {
        email: 'student@example.com',
        password: 'wrongpassword'
      };

      const result = await authService.signinAccount(credentials);

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(verifyPassword).toHaveBeenCalledWith(credentials.password, mockUser.password);
    });

    it('should return null for non-existent user', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      const result = await authService.signinAccount(credentials);

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(verifyPassword).not.toHaveBeenCalled();
    });

    it('should handle user without role', async () => {
      const userWithoutRole = { ...mockUser, userRoleId: undefined };
      mockUsersService.findByEmail.mockResolvedValue(userWithoutRole as any);
      (verifyPassword as jest.Mock).mockResolvedValue(true);
      (JWT.sign as jest.Mock).mockReturnValue('mock-jwt-token');
      (SETTINGS as any).APP_JWT_SECRET_KEY = 'secret';

      const credentials = {
        email: 'student@example.com',
        password: 'Password123!'
      };

      const result = await authService.signinAccount(credentials);

      expect(result).toEqual({
        authToken: 'mock-jwt-token'
      });
      expect(JWT.sign).toHaveBeenCalledWith(
        { user: { ...userWithoutRole, password: undefined, roleName: undefined } },
        'secret',
        { expiresIn: '1h' }
      );
    });
  });

  describe('signupAccount', () => {
    const mockNewUser = {
      id: 3,
      email: 'newuser@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'hashedpassword',
      userRoleId: 2
    };

    it('should create new user account', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.createUser.mockResolvedValue(mockNewUser as any);

      const accountData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'newuser@example.com',
        password: 'Password123!',
        userRoleId: 2
      };

      const result = await authService.signupAccount(accountData);

      expect(result).toEqual({
        accountExists: false,
        user: { ...mockNewUser, password: undefined }
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(accountData.email);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        ...accountData,
        isEnabled: true,
        isEmailVerified: false,
        twoFactorEnabled: false,
        failedLoginAttempts: 0
      });
    });

    it('should return accountExists true for existing email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockNewUser as any);

      const accountData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'newuser@example.com',
        password: 'Password123!',
        userRoleId: 2
      };

      const result = await authService.signupAccount(accountData);

      expect(result).toEqual({
        accountExists: true
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(accountData.email);
      expect(mockUsersService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('requestOtp', () => {
    it('should exist as a method', () => {
      expect(typeof authService.requestOtp).toBe('function');
    });

    it('should be callable', async () => {
      const data = { email: 'test@example.com', type: 'EMAIL_VERIFICATION' as any };
      await expect(authService.requestOtp(data)).resolves.not.toThrow();
    });
  });
});
