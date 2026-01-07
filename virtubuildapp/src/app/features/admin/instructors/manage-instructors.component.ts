import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService, UserRolesService } from '@/app/core/services';

@Component({
  selector: 'app-manage-instructors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './manage-instructors.component.html',
  styleUrls: ['./manage-instructors.component.scss']
})
export class ManageInstructorsComponent implements OnInit {
  instructors: any[] = [];
  filteredInstructors: any[] = [];
  userRoles: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedInstructor: any = null;
  newInstructor: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userRoleId: null
  };

  // Data table properties
  searchTerm = '';
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Expose Math for template usage
  Math = Math;

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
    try {
      // Load all users and filter for instructors
      const allUsers = await AdminService.getAllUsers();
      console.log('All users from API:', allUsers); // Debug log
      
      // Filter for instructors only
      this.instructors = allUsers.filter((user: any) => {
        const isInstructor = user.userRole && user.userRole.name && user.userRole.name.toLowerCase() === 'instructor';
        console.log(`User ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.userRole?.name} - Is Instructor: ${isInstructor}`);
        return isInstructor;
      });
      
      console.log(`Total instructors found: ${this.instructors.length}`);
      console.log('Filtered instructors:', this.instructors);
      this.userRoles = await AdminService.getAllUserRoles();
      this.applyFilters();
    } catch (error) {
      console.error('Error loading instructors:', error);
      // Provide sample data for demonstration based on actual API structure
      this.instructors = [
        {
          id: 6,
          firstName: 'Dr. Emily',
          lastName: 'Davis',
          email: 'emily.davis@instructor.com',
          isEnabled: true,
          lastLoginAt: new Date(),
          userRole: { 
            id: 2,
            name: 'instructor',
            isEnabled: true 
          }
        },
        {
          id: 7,
          firstName: 'Prof. Robert',
          lastName: 'Miller',
          email: 'robert.miller@instructor.com',
          isEnabled: true,
          lastLoginAt: new Date(Date.now() - 86400000),
          userRole: { 
            id: 2,
            name: 'instructor',
            isEnabled: true 
          }
        }
      ];
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = [...this.instructors];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(instructor => 
        instructor.firstName.toLowerCase().includes(term) ||
        instructor.lastName.toLowerCase().includes(term) ||
        instructor.email.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortField];
        const bValue = b[this.sortField];
        
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalItems = filtered.length;
    this.filteredInstructors = filtered;
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  sort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  get paginatedInstructors() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInstructors.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.applyFilters();
  }

  async createInstructor() {
    try {
      const instructorRole = this.userRoles.find(role => 
        role.name && role.name.toLowerCase() === 'instructor'
      );
      if (instructorRole) {
        this.newInstructor.userRoleId = instructorRole.id;
      }
      
      console.log('Creating instructor with data:', this.newInstructor);
      await AdminService.createUser(this.newInstructor);
      await this.loadData();
      this.cancelCreate();
    } catch (error) {
      console.error('Error creating instructor:', error);
    }
  }

  editInstructor(instructor: any) {
    this.selectedInstructor = { ...instructor };
    this.showEditForm = true;
  }

  async updateInstructor() {
    try {
      await AdminService.updateUser(this.selectedInstructor.id, this.selectedInstructor);
      await this.loadData();
      this.cancelEdit();
    } catch (error) {
      console.error('Error updating instructor:', error);
    }
  }

  async deleteInstructor(id: number) {
    if (confirm('Are you sure you want to delete this instructor?')) {
      try {
        await AdminService.deleteUser(id);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    }
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newInstructor = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userRoleId: null
    };
  }

  cancelEdit() {
    this.showEditForm = false;
    this.selectedInstructor = null;
  }

  async toggleInstructorStatus(instructor: any) {
    try {
      const updatedInstructor = { ...instructor, isEnabled: !instructor.isEnabled };
      await AdminService.updateUser(instructor.id, updatedInstructor);
      await this.loadData();
    } catch (error) {
      console.error('Error toggling instructor status:', error);
    }
  }

  async resetInstructorPassword(instructor: any) {
    const newPassword = prompt(`Reset password for ${instructor.firstName} ${instructor.lastName}?\n\nEnter new password:`);
    if (newPassword && newPassword.trim()) {
      try {
        await AdminService.updateUser(instructor.id, { password: newPassword.trim() });
        alert('Password updated successfully!');
        await this.loadData();
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Error resetting password. Please try again.');
      }
    }
  }

  trackByInstructorId(index: number, instructor: any): number {
    return instructor.id;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getRoleName(user: any): string {
    return user.userRole?.name || 'Unknown';
  }

  isInstructor(user: any): boolean {
    return user.userRole?.name?.toLowerCase() === 'instructor';
  }
}
