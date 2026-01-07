import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface SidebarItem {
  route: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DashboardSidebarComponent {
  @Input() appTitle: string = '';
  @Input() sidebarItems: SidebarItem[] = [];
}
