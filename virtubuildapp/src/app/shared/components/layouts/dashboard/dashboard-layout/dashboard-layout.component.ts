import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';
import { USER_TYPES } from '@/app/shared/utils/types.utils';
import { selectUserType, selectUserProfile } from '@/app/core/store/user';
import { setUserType, setUserProfile } from '@/app/core/store/user/user.actions';
import { AuthenticationService } from '@/app/core/services';

interface UserProfile {
  name: string;
  avatar?: string;
}

interface SidebarItem {
  label: string;
  route: string;
  icon?: string;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DashboardSidebarComponent,
    DashboardNavbarComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit {
  @Input() appTitle!: string;
  userType$;
  userProfile$;
  currentUserType: USER_TYPES | null = null;
  sidebarCollapsed = false;

  constructor(private store: Store, private cdr: ChangeDetectorRef) {
    this.userType$ = this.store.select(selectUserType);
    this.userProfile$ = this.store.select(selectUserProfile);
  }

  ngOnInit() {
    this.userType$.subscribe((type) => {
      this.currentUserType = type;
      this.cdr.detectChanges();
    });

    const existingType = this.currentUserType;
    if (!existingType) {
      const role = AuthenticationService.getRole();
      const token = AuthenticationService.getToken();
      if (role) {
        const normalized = (role as string).toLowerCase();
        this.store.dispatch(setUserType({ userType: normalized as any }));
      }
      if (token) {
        try {
          const parts = token.split('.');
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          const user = payload?.user || {};
          const id = user.id || user.userId;
          const name = user.name || user.fullName || user.email || '';
          const email = user.email || undefined;
          const avatar = user.avatar || undefined;
          this.store.dispatch(setUserProfile({ id, name, email, avatar }));
        } catch {}
      }
    }
    this.cdr.detectChanges();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  get sidebarItems(): SidebarItem[] {
    // Hard fallback: if JWT says student/instructor/admin, always show that menu immediately
    const roleFromToken = (AuthenticationService.getRole() || '').toLowerCase();
    if (roleFromToken === 'student') {
      return [
        { label: 'Dashboard', route: '/student', icon: 'dashboard' },
        { label: 'Activities', route: '/student/activities', icon: 'assignment' },
        { label: 'Grades', route: '/student/grades', icon: 'grade' },
        { label: 'Analytics', route: '/student/analytics', icon: 'analytics' },
        { label: 'Progress', route: '/student/progress', icon: 'trending_up' },
        { label: 'Assessments', route: '/student/assessments', icon: 'quiz' },
      ];
    }

    let effectiveType = this.currentUserType;
    if (!effectiveType) {
      effectiveType = (roleFromToken || null) as any;
    }
    if (!effectiveType) return [];

    console.log(effectiveType)

    switch (effectiveType) {
      case USER_TYPES.ADMIN:
        return [
          {
            label: 'Manage Instructors',
            route: '/admin/instructors',
            icon: 'person',
          },
          {
            label: 'Manage Students',
            route: '/admin/students',
            icon: 'school',
          },
          {
            label: 'Manage Contents',
            route: '/admin/contents',
            icon: 'menu_book',
            children: [
              {
                label: 'Laboratories',
                route: '/admin/contents/laboratories',
              },
              {
                label: 'Assessments',
                route: '/admin/contents/assessments',
              },
            ],
          },
        ];
      case USER_TYPES.INSTRUCTOR:
        return [
          {
            label: 'Manage Laboratory Activities',
            route: '/instructor/laboratories',
            icon: 'science',
          },
          {
            label: 'Manage Assessments',
            route: '/instructor/assessments',
            icon: 'assignment',
          },
          {
            label: 'Manage Student Grades',
            route: '/instructor/grades',
            icon: 'grade',
          },
        ];
      case USER_TYPES.STUDENT:
        return [
          {
            label: 'Dashboard',
            route: '/student',
            icon: 'dashboard',
          },
          {
            label: 'Activities',
            route: '/student/activities',
            icon: 'assignment',
          },
          {
            label: 'Grades',
            route: '/student/grades',
            icon: 'grade',
          },
          {
            label: 'Analytics',
            route: '/student/analytics',
            icon: 'analytics',
          },
          {
            label: 'Progress',
            route: '/student/progress',
            icon: 'trending_up',
          },
          {
            label: 'Gamification',
            route: '/student/gamification',
            icon: 'emoji_events',
          },
          {
            label: 'Assessments',
            route: '/student/assessments',
            icon: 'quiz',
          },
        ];
      default:
        return [];
    }
  }
}
