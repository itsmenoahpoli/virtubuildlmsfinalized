import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-shell.component.html',
  styleUrls: ['./page-shell.component.scss'],
})
export class PageShellComponent {
  @Input() title = '';
  @Input() subtitle = '';
}


