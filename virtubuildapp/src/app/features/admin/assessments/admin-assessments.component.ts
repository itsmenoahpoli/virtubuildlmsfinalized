import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService } from '@/app/core/services';

@Component({
  selector: 'app-admin-assessments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './admin-assessments.component.html',
  styleUrls: ['./admin-assessments.component.scss']
})
export class AdminAssessmentsComponent implements OnInit {
  assessments: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedAssessment: any = null;
  newAssessment: any = { title: '', description: '' };

  async ngOnInit() {
    try {
      await this.loadAssessments();
    } finally {
      this.loading = false;
    }
  }

  async loadAssessments() {
    const res = await AdminService.getAllAssessments();
    this.assessments = res?.data || res || [];
  }

  createAssessment() { this.showCreateForm = true; }
  editAssessment(a: any) { this.selectedAssessment = { ...a }; this.showEditForm = true; }
  cancelCreate(event?: MouseEvent) { if (event) event.stopPropagation(); this.showCreateForm = false; this.newAssessment = { title: '', description: '' }; }
  cancelEdit(event?: MouseEvent) { if (event) event.stopPropagation(); this.showEditForm = false; this.selectedAssessment = null; }

  async submitCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    await AdminService.createAssessment(this.newAssessment);
    await this.loadAssessments();
    this.cancelCreate();
  }

  async submitEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.selectedAssessment?.id) return;
    await AdminService.updateAssessment(this.selectedAssessment.id, {
      title: this.selectedAssessment.title,
      description: this.selectedAssessment.description
    });
    await this.loadAssessments();
    this.cancelEdit();
  }

  async deleteAssessment(id: number) {
    await AdminService.deleteAssessment(id);
    await this.loadAssessments();
  }
}


