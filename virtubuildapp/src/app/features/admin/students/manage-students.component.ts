import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService, UserRolesService } from '@/app/core/services';

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  userRoles: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedStudent: any = null;
  newStudent: any = {
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
      // Load all users and filter for students
      const allUsers = await AdminService.getAllUsers();
      console.log('All users from API:', allUsers); // Debug log
      
      // Filter for students only
      this.students = allUsers.filter((user: any) => {
        const isStudent = user.userRole && user.userRole.name && user.userRole.name.toLowerCase() === 'student';
        console.log(`User ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.userRole?.name} - Is Student: ${isStudent}`);
        return isStudent;
      });
      
      console.log(`Total students found: ${this.students.length}`);
      console.log('Filtered students:', this.students);
      this.userRoles = await AdminService.getAllUserRoles();
      this.applyFilters();
    } catch (error) {
      console.error('Error loading students:', error);
      // Provide sample data for demonstration based on actual API structure
      this.students = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@student.com',
          isEnabled: true,
          lastLoginAt: new Date(),
          userRole: { 
            id: 1,
            name: 'student',
            isEnabled: true 
          }
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@student.com',
          isEnabled: true,
          lastLoginAt: new Date(Date.now() - 86400000),
          userRole: { 
            id: 1,
            name: 'student',
            isEnabled: true 
          }
        },
        {
          id: 3,
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@student.com',
          isEnabled: false,
          lastLoginAt: null,
          userRole: { 
            id: 1,
            name: 'student',
            isEnabled: true 
          }
        },
        {
          id: 4,
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@student.com',
          isEnabled: true,
          lastLoginAt: null,
          userRole: { 
            id: 1,
            name: 'student',
            isEnabled: true 
          }
        },
        {
          id: 5,
          firstName: 'Alex',
          lastName: 'Brown',
          email: 'alex.brown@student.com',
          isEnabled: true,
          lastLoginAt: null,
          userRole: { 
            id: 1,
            name: 'student',
            isEnabled: true 
          }
        }
      ];
      this.applyFilters();
    }
  }

  applyFilters() {
    let filtered = [...this.students];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
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
    this.filteredStudents = filtered;
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

  get paginatedStudents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredStudents.slice(startIndex, startIndex + this.itemsPerPage);
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

  async createStudent() {
    try {
      const studentRole = this.userRoles.find(role => 
        role.name && role.name.toLowerCase() === 'student'
      );
      if (studentRole) {
        this.newStudent.userRoleId = studentRole.id;
      }
      
      console.log('Creating student with data:', this.newStudent);
      await AdminService.createUser(this.newStudent);
      await this.loadData();
      this.cancelCreate();
    } catch (error) {
      console.error('Error creating student:', error);
    }
  }

  editStudent(student: any) {
    this.selectedStudent = { ...student };
    this.showEditForm = true;
  }

  async updateStudent() {
    try {
      await AdminService.updateUser(this.selectedStudent.id, this.selectedStudent);
      await this.loadData();
      this.cancelEdit();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  }

  async deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await AdminService.deleteUser(id);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  }

  async toggleStudentStatus(student: any) {
    try {
      const updatedStudent = { ...student, isEnabled: !student.isEnabled };
      await AdminService.updateUser(student.id, updatedStudent);
      await this.loadData();
    } catch (error) {
      console.error('Error toggling student status:', error);
    }
  }

  async resetStudentPassword(student: any) {
    const newPassword = prompt(`Reset password for ${student.firstName} ${student.lastName}?\n\nEnter new password:`);
    if (newPassword && newPassword.trim()) {
      try {
        await AdminService.updateUser(student.id, { password: newPassword.trim() });
        alert('Password updated successfully!');
        await this.loadData();
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Error resetting password. Please try again.');
      }
    }
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newStudent = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      userRoleId: null
    };
  }

  cancelEdit() {
    this.showEditForm = false;
    this.selectedStudent = null;
  }

  trackByStudentId(index: number, student: any): number {
    return student.id;
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

  isStudent(user: any): boolean {
    return user.userRole?.name?.toLowerCase() === 'student';
  }
}
