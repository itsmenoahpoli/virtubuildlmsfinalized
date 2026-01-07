import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GradesService } from '@/app/core/services';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';

@Component({
  selector: 'app-grades-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './grades-page.component.html',
  styleUrls: ['./grades-page.component.scss'],
})
export class GradesPageComponent implements OnInit {
  appTitle = 'VirtuBuild';
  grades: any[] = [];

  async ngOnInit() {
    const res = await GradesService.listMine();
    this.grades = res?.data || [];
  }

  getAverageGrade(): number {
    if (this.grades.length === 0) return 0;
    const sum = this.grades.reduce((acc, grade) => acc + (grade.score || 0), 0);
    return Math.round(sum / this.grades.length);
  }

  getHighestGrade(): number {
    if (this.grades.length === 0) return 0;
    return Math.max(...this.grades.map(grade => grade.score || 0));
  }

  getScoreClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  }

  getStatusClass(score: number): string {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  }

  getStatusText(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    return 'Needs Improvement';
  }
}


