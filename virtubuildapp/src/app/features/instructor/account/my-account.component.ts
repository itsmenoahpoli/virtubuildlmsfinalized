import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { UsersService, AuthenticationService } from '@/app/core/services';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  appTitle = 'VirtuBuild';
  user: any = null;
  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

  profileForm = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showPasswordForm = false;

  constructor() {}

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    this.loading = true;
    this.error = null;
    try {
      const response = await UsersService.getMyProfile();
      this.user = response?.data;
      
      if (this.user) {
        this.profileForm = {
          firstName: this.user.firstName || '',
          lastName: this.user.lastName || '',
          middleName: this.user.middleName || '',
          email: this.user.email || ''
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.error = 'Failed to load profile information';
    } finally {
      this.loading = false;
    }
  }

  async updateProfile() {
    this.saving = true;
    this.error = null;
    this.success = null;

    try {
      const updateData = {
        firstName: this.profileForm.firstName,
        lastName: this.profileForm.lastName,
        middleName: this.profileForm.middleName,
        email: this.profileForm.email
      };

      await UsersService.updateMyProfile(updateData);
      this.success = 'Profile updated successfully';
      
      setTimeout(() => {
        this.success = null;
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      this.error = 'Failed to update profile';
    } finally {
      this.saving = false;
    }
  }

  async updatePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.error = 'New passwords do not match';
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.error = 'New password must be at least 6 characters long';
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    try {
      await AuthenticationService.resetPassword('current', this.passwordForm.newPassword);
      this.success = 'Password updated successfully';
      
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.showPasswordForm = false;

      setTimeout(() => {
        this.success = null;
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      this.error = 'Failed to update password. Please check your current password.';
    } finally {
      this.saving = false;
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.error = null;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  getRoleDisplay(): string {
    if (!this.user || !this.user.userRole) return 'Unknown';
    
    switch (this.user.userRole.roleName) {
      case 'instructor': return 'Instructor';
      case 'admin': return 'Administrator';
      case 'student': return 'Student';
      default: return this.user.userRole.roleName;
    }
  }
}
