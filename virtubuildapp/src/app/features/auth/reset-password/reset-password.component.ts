import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from '@/app/shared/components/layouts/dashboard/dashboard-layout/dashboard-layout.component';
import { PageShellComponent } from '@/app/shared/components/layouts/page-shell/page-shell.component';
import { AuthenticationService } from '@/app/core/services';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardLayoutComponent, PageShellComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token = '';
  password = '';
  confirm = '';
  done = false;

  constructor(private route: ActivatedRoute) {
    this.token = String(this.route.snapshot.queryParamMap.get('token') || '');
  }

  async submit() {
    if (!this.password || this.password !== this.confirm) return;
    try {
      await AuthenticationService.resetPassword(this.token, this.password);
      this.done = true;
    } catch {
      this.done = true;
    }
  }
}


