import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { ActivitiesService, AssessmentsService, GradesService } from '@/app/core/services';

@Component({
  selector: 'app-manage-activities',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './manage-activities.component.html',
  styleUrls: ['./manage-activities.component.scss'],
})
export class ManageActivitiesComponent implements OnInit {
  appTitle = 'VirtuBuild';
  activities: any[] = [];
  searchTerm = '';
  loading = false;
  error: string | null = null;
  itemsPerPage = 10;
  currentPage = 1;
  sortField: 'title' | 'location' | 'capacity' | 'isEnabled' | 'createdAt' = 'title';
  sortDirection: 'asc' | 'desc' = 'asc';
  showAssessmentsModal = false;
  showGradesModal = false;
  selectedActivity: any = null;
  activityAssessments: any[] = [];
  activityGrades: any[] = [];

  async ngOnInit() {
    await this.loadActivities();
  }

  async loadActivities() {
    this.loading = true;
    this.error = null;
    try {
      const response = await ActivitiesService.list();
      this.activities = response?.data || response || [];
      this.currentPage = 1;
    } catch (error) {
      console.error('Error loading activities:', error);
      this.error = 'Failed to load activities';
    } finally {
      this.loading = false;
    }
  }

  get filteredActivities() {
    let results = this.activities;
    const term = this.searchTerm?.toLowerCase().trim();
    if (term) {
      results = results.filter(a =>
        (a.title || '').toLowerCase().includes(term) ||
        (a.description || '').toLowerCase().includes(term) ||
        (a.location || '').toLowerCase().includes(term)
      );
    }
    results = [...results].sort((a, b) => {
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      const av = a[this.sortField] ?? '';
      const bv = b[this.sortField] ?? '';
      if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv) * dir;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return results;
  }

  get totalItems() {
    return this.filteredActivities.length;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  get paginatedActivities() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredActivities.slice(start, start + this.itemsPerPage);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  onItemsPerPageChange(value: number) {
    this.itemsPerPage = Number(value) || 10;
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  getPageNumbers() {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    return pages;
  }

  sort(field: typeof this.sortField) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  async openAssessments(activity: any) {
    this.selectedActivity = activity;
    try {
      const res = await AssessmentsService.getByLabActivity(activity.id);
      this.activityAssessments = res?.data || res || [];
    } catch (e) {
      this.activityAssessments = [];
    }
    this.showAssessmentsModal = true;
  }

  async openGrades(activity: any) {
    this.selectedActivity = activity;
    try {
      const res = await GradesService.listForActivity(activity.id);
      this.activityGrades = res?.data || res || [];
    } catch (e) {
      this.activityGrades = [];
    }
    this.showGradesModal = true;
  }

  closeModals() {
    this.showAssessmentsModal = false;
    this.showGradesModal = false;
    this.selectedActivity = null;
  }

  getGradeStudentName(grade: any): string {
    const user = grade.user || grade.student;
    const first = user?.firstName || user?.firstname || grade.studentFirstName;
    const last = user?.lastName || user?.lastname || grade.studentLastName;
    const full = [first, last].filter(Boolean).join(' ').trim();
    if (full) return full;
    return user?.name || grade.studentName || user?.email || grade.userEmail || grade.email || '-';
  }

  getGradeAssessmentTitle(grade: any): string {
    if (grade.activity) {
      return grade.activity.title
    }

    return '-'
  }

  async refreshActivities() {
    await this.loadActivities();
  }

}
