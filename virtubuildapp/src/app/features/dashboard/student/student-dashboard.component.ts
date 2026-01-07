import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ModulesService,
  AnalyticsService,
  StudentProgressService,
  GradesService,
  AssessmentSubmissionsService,
  ActivitiesService
} from '@/app/core/services';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
})
export class StudentDashboardComponent implements OnInit {
  appTitle = 'VirtuBuild';

  statistics = {
    totalActivities: 0,
    completedActivities: 0,
    averageGrade: 0,
    assessmentsTaken: 0
  };

  recentActivities: any[] = [];
  recentGrades: any[] = [];
  recentAssessments: any[] = [];
  modules: any[] = [];
  selectedFilter = 'all';

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const [progressRes, gradesRes, assessmentsRes] = await Promise.all([
        StudentProgressService.getCompletionStats(),
        GradesService.listMine(),
        AssessmentSubmissionsService.getMyHistory()
      ]);

      this.statistics = {
        totalActivities: progressRes?.data?.totalActivities || 0,
        completedActivities: progressRes?.data?.completedActivities || 0,
        averageGrade: progressRes?.data?.averageGrade || 0,
        assessmentsTaken: progressRes?.data?.assessmentsTaken || 0
      };

      this.recentGrades = gradesRes?.data?.slice(0, 5) || [];
      this.recentAssessments = assessmentsRes?.data?.slice(0, 5) || [];

      await this.loadModules();
      await this.loadRecentActivities();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async loadRecentActivities() {
    try {
      const activitiesRes = await ActivitiesService.list();
      console.log('Activities API response:', activitiesRes);
      this.recentActivities = activitiesRes?.data?.slice(0, 5) || [];
      console.log('Recent activities loaded:', this.recentActivities);

      if (this.recentActivities.length === 0 && this.modules.length > 0) {
        const allActivities = this.modules.flatMap(module => module.activities || []);
        this.recentActivities = allActivities.slice(0, 5);
        console.log('Extracted activities from modules:', this.recentActivities);
      }
    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  }

  async loadModules() {
    try {
      const modulesRes = await ModulesService.list();
      console.log('Modules API response:', modulesRes);
      this.modules = modulesRes?.data || [];
      console.log('Modules loaded:', this.modules);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  }

  onFilterChange() {
    console.log('Filter changed to:', this.selectedFilter);
  }
}


