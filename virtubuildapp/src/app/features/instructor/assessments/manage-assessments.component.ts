import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AssessmentsService, ActivitiesService } from '@/app/core/services';

@Component({
  selector: 'app-manage-assessments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: 'manage-assessments.component.html',
  styleUrls: ['manage-assessments.component.scss'],
})
export class ManageAssessmentsComponent implements OnInit {
  appTitle = 'VirtuBuild';
  loading = false;
  error: string | null = null;
  searchTerm = '';
  itemsPerPage = 10;
  currentPage = 1;
  sortField: 'title' | 'isEnabled' | 'timeLimit' | 'passingScore' | 'createdAt' = 'title';
  sortDirection: 'asc' | 'desc' = 'asc';
  assessments: any[] = [];
  activitiesById = new Map<number, any>();

  async ngOnInit() {
    await this.loadAssessments();
  }

  async loadAssessments() {
    this.loading = true;
    this.error = null;
    try {
      const res = await AssessmentsService.list();
      this.assessments = res?.data || res || [];
      this.currentPage = 1;
      const activityIds = Array.from(new Set(this.assessments.map((a: any) => a.labActivityId).filter(Boolean)));
      await Promise.all(activityIds.map(async (id) => {
        try {
          const activityRes = await ActivitiesService.getById(id);
          const act = activityRes?.data || activityRes;
          if (act) this.activitiesById.set(id, act);
        } catch {}
      }));
    } catch (e) {
      console.error('Failed to load assessments', e);
      this.error = 'Failed to load assessments';
    } finally {
      this.loading = false;
    }
  }

  get filteredAssessments() {
    const term = this.searchTerm.toLowerCase().trim();
    let results = this.assessments;
    if (term) {
      results = results.filter((a: any) =>
        (a.title || '').toLowerCase().includes(term) ||
        (a.description || '').toLowerCase().includes(term) ||
        (this.getActivityTitle(a.labActivityId) || '').toLowerCase().includes(term)
      );
    }
    results = [...results].sort((a: any, b: any) => {
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      const av = a[this.sortField] ?? '';
      const bv = b[this.sortField] ?? '';
      if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv) * dir;
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return results;
  }

  get totalItems() { return this.filteredAssessments.length; }
  get totalPages() { return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage)); }
  get paginatedAssessments() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAssessments.slice(start, start + this.itemsPerPage);
  }

  onSearchChange() { this.currentPage = 1; }
  onItemsPerPageChange(value: number) { this.itemsPerPage = Number(value) || 10; this.currentPage = 1; }
  onPageChange(page: number) { if (page < 1 || page > this.totalPages) return; this.currentPage = page; }
  getPageNumbers() { return Array.from({ length: this.totalPages }, (_, i) => i + 1); }
  sort(field: typeof this.sortField) {
    if (this.sortField === field) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else { this.sortField = field; this.sortDirection = 'asc'; }
  }

  getActivityTitle(id?: number) {
    if (!id) return '';
    const act = this.activitiesById.get(id);
    return act?.title || `Activity #${id}`;
  }

  async deleteAssessment(id: number) {
    if (!confirm('Delete this assessment?')) return;
    try {
      await AssessmentsService.delete(id);
      await this.loadAssessments();
    } catch (e) {
      console.error('Failed to delete assessment', e);
      this.error = 'Failed to delete assessment';
    }
  }
}



