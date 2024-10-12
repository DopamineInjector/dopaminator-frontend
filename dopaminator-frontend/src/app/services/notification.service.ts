import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification | null>(null);
  notifications$ = this.notificationsSubject.asObservable();

  success(message: string) {
    this.showNotification('success', message);
  }

  error(message: string) {
    this.showNotification('error', message);
  }

  private showNotification(type: 'success' | 'error', message: string) {
    this.notificationsSubject.next({ type, message });
    setTimeout(() => this.notificationsSubject.next(null), 3000);
  }
}
