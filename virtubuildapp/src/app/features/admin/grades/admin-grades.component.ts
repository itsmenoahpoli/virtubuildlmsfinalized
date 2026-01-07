import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService } from '@/app/core/services';

@Component({
  selector: 'app-admin-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './admin-grades.component.html',
  styleUrls: ['./admin-grades.component.scss']
})
export class AdminGradesComponent implements OnInit {
  grades: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedGrade: any = null;
  newGrade: any = { userId: '', activityId: '', score: '' };

  async ngOnInit() {
    try {
      await this.loadGrades();
    } finally {
      this.loading = false;
    }
  }

  async loadGrades() {
    const res = await AdminService.getAllGrades();
    this.grades = res?.data || res || [];
  }

  createGrade() { this.showCreateForm = true; }
  editGrade(g: any) { this.selectedGrade = { ...g }; this.showEditForm = true; }
  cancelCreate(event?: MouseEvent) { if (event) event.stopPropagation(); this.showCreateForm = false; this.newGrade = { userId: '', activityId: '', score: '' }; }
  cancelEdit(event?: MouseEvent) { if (event) event.stopPropagation(); this.showEditForm = false; this.selectedGrade = null; }

  async submitCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    await AdminService.createGrade({
      userId: Number(this.newGrade.userId),
      activityId: Number(this.newGrade.activityId),
      score: Number(this.newGrade.score)
    });
    await this.loadGrades();
    this.cancelCreate();
  }

  async submitEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.selectedGrade?.id) return;
    await AdminService.updateGrade(this.selectedGrade.id, {
      userId: Number(this.selectedGrade.userId),
      activityId: Number(this.selectedGrade.activityId),
      score: Number(this.selectedGrade.score)
    });
    await this.loadGrades();
    this.cancelEdit();
  }

  async deleteGrade(id: number) {
    await AdminService.deleteGrade(id);
    await this.loadGrades();
  }
}


