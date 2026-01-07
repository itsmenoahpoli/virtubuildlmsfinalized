import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { ModulesService, ActivationsService } from '@/app/core/services';

@Component({
  selector: 'app-manage-modules',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './manage-modules.component.html',
  styleUrls: ['./manage-modules.component.scss'],
})
export class ManageModulesComponent implements OnInit {
  modules: any[] = [];
  activations: Record<number, any[]> = {};

  async ngOnInit() {
    const res = await ModulesService.list();
    this.modules = res?.data || [];
    for (const m of this.modules) {
      const a = await ActivationsService.listByModule(m.id);
      this.activations[m.id] = a?.data || [];
    }
  }

  async activate(moduleId: number, groupName: string) {
    await ActivationsService.activate(moduleId, groupName);
    const a = await ActivationsService.listByModule(moduleId);
    this.activations[moduleId] = a?.data || [];
  }

  async deactivate(moduleId: number, groupName: string) {
    await ActivationsService.deactivate(moduleId, groupName);
    const a = await ActivationsService.listByModule(moduleId);
    this.activations[moduleId] = a?.data || [];
  }
}


