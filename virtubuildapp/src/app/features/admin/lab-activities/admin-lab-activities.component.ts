import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService } from '@/app/core/services';

@Component({
  selector: 'app-admin-lab-activities',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './admin-lab-activities.component.html',
  styleUrls: ['./admin-lab-activities.component.scss']
})
export class AdminLabActivitiesComponent implements OnInit {
  activities: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedActivity: any = null;
  newActivity: any = { title: '', description: '' };

  async ngOnInit() {
    try {
      await this.loadActivities();
    } finally {
      this.loading = false;
    }
  }

  async loadActivities() {
    const res = await AdminService.getAllLabActivities();
    this.activities = res?.data || res || [];
  }

  createActivity() {
    this.showCreateForm = true;
  }

  editActivity(a: any) {
    this.selectedActivity = { ...a };
    this.showEditForm = true;
  }

  cancelCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showCreateForm = false;
    this.newActivity = { title: '', description: '' };
  }

  cancelEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showEditForm = false;
    this.selectedActivity = null;
  }

  async submitCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    await AdminService.createLabActivity(this.newActivity);
    await this.loadActivities();
    this.cancelCreate();
  }

  async submitEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.selectedActivity?.id) return;
    await AdminService.updateLabActivity(this.selectedActivity.id, {
      title: this.selectedActivity.title,
      description: this.selectedActivity.description
    });
    await this.loadActivities();
    this.cancelEdit();
  }

  async deleteActivity(id: number) {
    await AdminService.deleteLabActivity(id);
    await this.loadActivities();
  }
}


