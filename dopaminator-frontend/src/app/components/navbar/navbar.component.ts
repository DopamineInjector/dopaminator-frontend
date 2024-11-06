import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { Views } from '../../types';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() userName?: string | null;

  @Output() logIn = new EventEmitter<string>();

  @Output() logOut = new EventEmitter<void>();

  protected readonly Views = Views;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  navigateToSlots() {
    if (this.userName) {
      this.router.navigate([Views.SLOTS_PAGE]);
    } else {
      this.notificationService.error('You must log in to access this page');
    }
  }
}
