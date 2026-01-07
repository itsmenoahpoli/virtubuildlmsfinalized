import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { clearUser } from '@/app/core/store/user';

interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
}

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss'],
})
export class DashboardNavbarComponent {
  @Input() userProfile: UserProfile | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();
  faBars = faBars;
  faSignOutAlt = faSignOutAlt;

  constructor(private store: Store, private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    this.store.dispatch(clearUser());
    this.router.navigate(['/signin']);
  }
}
