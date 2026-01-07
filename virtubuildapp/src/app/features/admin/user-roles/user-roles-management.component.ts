import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService } from '@/app/core/services';

@Component({
  selector: 'app-user-roles-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './user-roles-management.component.html',
  styleUrls: ['./user-roles-management.component.scss']
})
export class UserRolesManagementComponent implements OnInit {
  roles: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedRole: any = null;
  newRole: any = { name: '', description: '' };

  async ngOnInit() {
    try {
      await this.loadRoles();
    } finally {
      this.loading = false;
    }
  }

  async loadRoles() {
    const res = await AdminService.getAllUserRoles();
    this.roles = res?.data || res || [];
  }

  createRole() {
    this.showCreateForm = true;
  }

  editRole(role: any) {
    this.selectedRole = { ...role };
    this.showEditForm = true;
  }

  cancelCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showCreateForm = false;
    this.newRole = { name: '', description: '' };
  }

  cancelEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showEditForm = false;
    this.selectedRole = null;
  }

  async submitCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    await AdminService.createUserRole(this.newRole);
    await this.loadRoles();
    this.cancelCreate();
  }

  async submitEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.selectedRole?.id) return;
    await AdminService.updateUserRole(this.selectedRole.id, {
      name: this.selectedRole.name,
      description: this.selectedRole.description
    });
    await this.loadRoles();
    this.cancelEdit();
  }

  async deleteRole(id: number) {
    await AdminService.deleteUserRole(id);
    await this.loadRoles();
  }
}


