import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivitiesService, ModulesService } from '@/app/core/services';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';

@Component({
  selector: 'app-activities-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss'],
})
export class ActivitiesListComponent implements OnInit {
  @Input() moduleId?: number;
  appTitle = 'VirtuBuild';
  modules: any[] = [];
  activities: any[] = [];
  moduleTitles = '';

  async ngOnInit() {
    try {
      console.log('Starting to load modules...');
      const mods = await ModulesService.list();
      console.log('Raw modules response:', mods);

      this.modules = mods?.data || mods || [];
      console.log('Modules loaded:', this.modules);
      console.log('Modules count:', this.modules.length);
      console.log('Modules response structure:', JSON.stringify(this.modules, null, 2));

      this.extractActivitiesFromModules();
      this.moduleTitles = this.modules.map((m: any) => m?.title).filter(Boolean).join(', ');

      if (this.activities.length === 0 && this.modules.length === 0) {
        console.log('No modules found, creating test data...');
        this.createTestData();
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      this.createTestData();
    }
  }

  createTestData() {
    this.modules = [
      {
        id: 1,
        title: 'Computer Hardware Fundamentals',
        description: 'Learn the basics of computer hardware components',
        isEnabled: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Desktop Assembly',
        description: 'Step-by-step desktop computer assembly',
        isEnabled: true,
        updatedAt: new Date().toISOString()
      }
    ];

    this.activities = this.modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      isEnabled: module.isEnabled,
      moduleTitle: module.title,
      steps: [],
      updatedAt: module.updatedAt,
      type: 'module'
    }));

    console.log('Created test data:', this.activities);
  }

  extractActivitiesFromModules() {
    console.log('Extracting activities from modules...');
    this.activities = [];

    if (this.moduleId) {
      const targetModule = this.modules.find((module: any) => module.id === this.moduleId);
      if (targetModule && targetModule.activities) {
        this.activities = targetModule.activities.map((activity: any) => ({
          ...activity,
          moduleTitle: targetModule.title
        }));
        console.log('Activities from specific module:', this.activities);
      }
    } else {
      this.activities = this.modules.flatMap((module: any) =>
        (module.activities || []).map((activity: any) => ({
          ...activity,
          moduleTitle: module.title
        }))
      );
      console.log('All activities from all modules:', this.activities);
    }

    console.log('Activities found:', this.activities.length);

    if (this.activities.length === 0) {
      console.log('No activities found. Showing modules instead.');
      this.activities = this.modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description || 'No description available',
        isEnabled: module.isEnabled !== false,
        moduleTitle: module.title,
        steps: [],
        updatedAt: module.updatedAt || new Date().toISOString(),
        type: 'module'
      }));
      console.log('Converted modules to activities:', this.activities);
    }
  }

  onModuleChange(moduleId: number) {
    this.moduleId = moduleId;
    this.extractActivitiesFromModules();
  }
}


