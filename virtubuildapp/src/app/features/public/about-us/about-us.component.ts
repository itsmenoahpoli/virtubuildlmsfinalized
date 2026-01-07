import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@/app/shared/components/shared/app-header/app-header.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule, AppHeaderComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  headerLinks = [
    { label: 'Sign In', path: '/signin' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'About Us', path: '/about-us' },
  ];
}


