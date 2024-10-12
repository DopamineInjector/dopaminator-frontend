import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'notification-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  notification: { type: 'success' | 'error'; message: string } | null = null;

  constructor(private notificationService: NotificationService) {
    this.notificationService.notifications$.subscribe(
      (notification) => (this.notification = notification)
    );
  }
}
