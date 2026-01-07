import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDeleteModalComponent } from './shared/components/confirm-delete-modal/confirm-delete-modal.component';
import { SuccessModalComponent } from './shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDeleteModalComponent, SuccessModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'virtubuild-dashboard';
}
