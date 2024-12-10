import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GetBalanceResponse, Views } from '../../types';
import { NotificationService } from '../../services/notification.service';
import { ApiService } from '../../services/api.service';
import { combineLatestWith, Observable, Subject, switchMap } from 'rxjs';
import { BalanceChangeService } from '../../services/balanceChange.service';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnChanges {
  @Input() username?: string | null;

  @Output() logIn = new EventEmitter<string>();

  @Output() logOut = new EventEmitter<void>();

  balance$: Observable<GetBalanceResponse> | null = null;

  usernameChanged$ = new Subject<void>();

  protected readonly Views = Views;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private apiService: ApiService,
    private balanceChangedService: BalanceChangeService
  ) {}

  ngOnInit() {
    this.balanceChangedService.balanceChanged();
    this.balance$ = this.balanceChangedService.getBalanceChanged$().pipe(
      combineLatestWith(this.usernameChanged$.asObservable()),
      switchMap(() => this.apiService.getBalance())
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['username'] && this.username) {
      this.usernameChanged$.next();
    }
  }

  navigateToSlots() {
    if (this.username) {
      this.router.navigate([Views.SLOTS_PAGE]);
    } else {
      this.notificationService.error('You must log in to access this page');
    }
  }

  navigateToAccount(username?: string) {
    if (this.username) {
      this.router.navigate([Views.ACCOUNT_PAGE], {
        state: { username: username },
      });
    } else {
      this.notificationService.error('You must log in to access this page');
    }
  }

  navigateToStock(username?: string) {
    if (this.username) {
      this.router.navigate([Views.STOCK_PAGE], {
        state: { username: username },
      });
    } else {
      this.notificationService.error('You must log in to access this page');
    }
  }

  logout() {
    this.apiService.logout();
  }
}
