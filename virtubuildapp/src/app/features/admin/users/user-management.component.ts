import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService, UserRolesService } from '@/app/core/services';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  userRoles: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedUser: any = null;
  newUser: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userRoleId: null
  };

  async ngOnInit() {
    try {
      await this.loadData();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadData() {
    this.users = await AdminService.getAllUsers();
    this.userRoles = await UserRolesService.list();
  }

  async createUser() {
    try {
      await AdminService.createUser(this.newUser);
      this.newUser = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userRoleId: null
      };
      this.showCreateForm = false;
      await this.loadData();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  async updateUser() {
    try {
      await AdminService.updateUser(this.selectedUser.id, this.selectedUser);
      this.showEditForm = false;
      this.selectedUser = null;
      await this.loadData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await AdminService.deleteUser(id);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.showEditForm = true;
  }

  cancelEdit() {
    this.showEditForm = false;
    this.selectedUser = null;
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userRoleId: null
    };
  }
}
