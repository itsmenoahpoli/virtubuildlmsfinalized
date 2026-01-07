import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { StudentGroupsService, AdminService } from '@/app/core/services';

@Component({
  selector: 'app-student-groups-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './student-groups-management.component.html',
  styleUrls: ['./student-groups-management.component.scss']
})
export class StudentGroupsManagementComponent implements OnInit {
  groups: any[] = [];
  students: any[] = [];
  loading = true;
  showCreateForm = false;
  showAssignForm = false;
  selectedGroup: any = null;
  newGroup: any = {
    name: '',
    description: '',
    isActive: true
  };
  assignmentData: any = {
    groupId: null,
    studentId: null
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
    this.groups = await StudentGroupsService.list();
    this.students = await AdminService.getAllUsers();
  }

  async createGroup() {
    try {
      await StudentGroupsService.create(this.newGroup);
      this.newGroup = {
        name: '',
        description: '',
        isActive: true
      };
      this.showCreateForm = false;
      await this.loadData();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  }

  async updateGroup(group: any) {
    try {
      await StudentGroupsService.update(group.id, group);
      await this.loadData();
    } catch (error) {
      console.error('Error updating group:', error);
    }
  }

  async deleteGroup(id: number) {
    if (confirm('Are you sure you want to delete this group?')) {
      try {
        await StudentGroupsService.delete(id);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  }

  async assignStudent() {
    try {
      await StudentGroupsService.assignStudent(this.assignmentData.groupId, this.assignmentData.studentId);
      this.assignmentData = {
        groupId: null,
        studentId: null
      };
      this.showAssignForm = false;
      await this.loadData();
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  }

  async removeStudent(groupId: number, studentId: number) {
    if (confirm('Are you sure you want to remove this student from the group?')) {
      try {
        await StudentGroupsService.removeStudent(groupId, studentId);
        await this.loadData();
      } catch (error) {
        console.error('Error removing student:', error);
      }
    }
  }

  async getGroupStudents(groupId: number) {
    try {
      return await StudentGroupsService.getStudents(groupId);
    } catch (error) {
      console.error('Error loading group students:', error);
      return [];
    }
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newGroup = {
      name: '',
      description: '',
      isActive: true
    };
  }

  cancelAssign() {
    this.showAssignForm = false;
    this.assignmentData = {
      groupId: null,
      studentId: null
    };
  }
}
