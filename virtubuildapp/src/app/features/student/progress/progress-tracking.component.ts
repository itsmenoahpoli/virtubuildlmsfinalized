import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentProgressService } from '@/app/core/services';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent],
  templateUrl: './progress-tracking.component.html',
  styleUrls: ['./progress-tracking.component.scss']
})
export class ProgressTrackingComponent implements OnInit {
  appTitle = 'VirtuBuild';
  myProgress: any = {};
  assignedActivities: any[] = [];
  assignedModules: any[] = [];
  completionStats: any = {};
  loading = true;

  async ngOnInit() {
    try {
      await this.loadProgressData();
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadProgressData() {
    this.myProgress = await StudentProgressService.getMyProgress();
    this.assignedActivities = await StudentProgressService.getAssignedActivities();
    this.assignedModules = await StudentProgressService.getAssignedModules();
    this.completionStats = await StudentProgressService.getCompletionStats();
  }

  async submitProgress(progressData: any) {
    try {
      await StudentProgressService.submitProgress(progressData);
      await this.loadProgressData();
    } catch (error) {
      console.error('Error submitting progress:', error);
    }
  }

  getCompletionPercentage(completed: number, total: number) {
    return total > 0 ? (completed / total) * 100 : 0;
  }

  getProgressStatus(activity: any) {
    if (activity.completed) return 'completed';
    if (activity.inProgress) return 'in-progress';
    return 'not-started';
  }
}
