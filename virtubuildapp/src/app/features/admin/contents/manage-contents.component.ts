import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';

@Component({
  selector: 'app-manage-contents',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './manage-contents.component.html',
  styleUrls: ['./manage-contents.component.scss']
})
export class ManageContentsComponent implements OnInit {

  ngOnInit() {
    // Component initialization
  }

  contentCategories = [
    {
      title: 'Laboratories',
      description: 'Manage laboratory activities and experiments',
      route: '/admin/contents/laboratories',
      icon: 'science',
      color: '#e74c3c'
    },
    {
      title: 'Assessments',
      description: 'Manage student assessments and evaluations',
      route: '/admin/contents/assessments',
      icon: 'assignment',
      color: '#2ecc71'
    }
  ];
}
