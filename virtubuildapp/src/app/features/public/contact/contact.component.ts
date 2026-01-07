import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@/app/shared/components/shared/app-header/app-header.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AppHeaderComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  headerLinks = [
    { label: 'Sign In', path: '/signin' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'About Us', path: '/about-us' },
  ];

  form = { name: '', email: '', message: '' };
  submitted = false;

  async submit() {
    this.submitted = true;
  }
}


