import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '@/app/core/services';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent implements OnInit {
  appTitle = 'VirtuBuild';
  analytics: any[] = [];

  async ngOnInit() {
    const res = await AnalyticsService.getMine();
    this.analytics = res?.data || [];
  }

  getTotalTimeSpent(): string {
    const totalSeconds = this.analytics.reduce((acc, stat) => acc + (stat.timeSpentSeconds || 0), 0);
    return this.formatTime(totalSeconds);
  }

  getTotalErrors(): number {
    return this.analytics.reduce((acc, stat) => acc + (stat.errorCount || 0), 0);
  }

  getAverageAccuracy(): number {
    if (this.analytics.length === 0) return 0;
    const totalAccuracy = this.analytics.reduce((acc, stat) => {
      return acc + this.getAccuracy(stat.errorCount || 0, stat.timeSpentSeconds || 0);
    }, 0);
    return Math.round(totalAccuracy / this.analytics.length);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  getAccuracy(errorCount: number, timeSpent: number): number {
    if (timeSpent === 0) return 100;
    const errorRate = (errorCount / timeSpent) * 100;
    return Math.max(0, Math.round(100 - errorRate));
  }

  getErrorClass(errorCount: number): string {
    if (errorCount === 0) return 'no-errors';
    if (errorCount <= 3) return 'low-errors';
    if (errorCount <= 10) return 'medium-errors';
    return 'high-errors';
  }

  getAccuracyClass(errorCount: number, timeSpent: number): string {
    const accuracy = this.getAccuracy(errorCount, timeSpent);
    if (accuracy >= 90) return 'excellent';
    if (accuracy >= 80) return 'good';
    if (accuracy >= 70) return 'average';
    return 'poor';
  }
}


