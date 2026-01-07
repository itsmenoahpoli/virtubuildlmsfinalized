import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AdminService } from '@/app/core/services';

@Component({
  selector: 'app-admin-modules',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './admin-modules.component.html',
  styleUrls: ['./admin-modules.component.scss']
})
export class AdminModulesComponent implements OnInit {
  modules: any[] = [];
  loading = true;
  showCreateForm = false;
  showEditForm = false;
  selectedModule: any = null;
  newModule: any = { title: '', description: '' };

  async ngOnInit() {
    try {
      await this.loadModules();
    } finally {
      this.loading = false;
    }
  }

  async loadModules() {
    const res = await AdminService.getAllModules();
    this.modules = res?.data || res || [];
  }

  createModule() {
    this.showCreateForm = true;
  }

  editModule(m: any) {
    this.selectedModule = { ...m };
    this.showEditForm = true;
  }

  cancelCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showCreateForm = false;
    this.newModule = { title: '', description: '' };
  }

  cancelEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.showEditForm = false;
    this.selectedModule = null;
  }

  async submitCreate(event?: MouseEvent) {
    if (event) event.stopPropagation();
    await AdminService.createModule(this.newModule);
    await this.loadModules();
    this.cancelCreate();
  }

  async submitEdit(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (!this.selectedModule?.id) return;
    await AdminService.updateModule(this.selectedModule.id, {
      title: this.selectedModule.title,
      description: this.selectedModule.description
    });
    await this.loadModules();
    this.cancelEdit();
  }

  async deleteModule(id: number) {
    await AdminService.deleteModule(id);
    await this.loadModules();
  }
}


