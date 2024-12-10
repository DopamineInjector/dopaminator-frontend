import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPostDialogComponent } from '../add-post-dialog/add-post-dialog.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  CreatePostRequest,
  GetBalanceResponse,
  GetUserResponse,
  Post,
  TransferModalContext,
} from '../types';
import { MatTabsModule } from '@angular/material/tabs';
import { UserInventoryComponent } from '../components/user-inventory/user-inventory.component';
import { TransferModalComponent } from '../components/transfer-modal/transfer-modal.component';
import { NotificationService } from '../services/notification.service';
import { BalanceChangeService } from '../services/balanceChange.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    UserInventoryComponent,
  ],
  standalone: true,
})
export class UserAccountComponent implements OnChanges, OnDestroy {
  @Input() username?: string | null;

  user$: Observable<GetUserResponse> | undefined;

  balance$: Observable<GetBalanceResponse> | undefined;

  placeholderAvatar: string =
    'https://cdn0.iconfinder.com/data/icons/gambling-48/512/gambler-bet-gambling-casino-avatar-512.png';

  currentUser: boolean = false;

  componentDestroyed$ = new Subject<void>();

  constructor(
    private cookieService: CookieService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private balanceChangeService: BalanceChangeService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      if (this.username) {
        this.loadUserData();
      }
    }
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  loadUserData() {
    this.user$ = this.apiService.getUser({ username: this.username! });
    this.currentUser = this.username == this.cookieService.get('username');
    if (this.currentUser) {
      this.balance$ = this.apiService.getBalance();
    }
  }

  addPost() {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '400px',
      data: { isEditing: false },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result: CreatePostRequest) => {
        if (result) {
          this.apiService.addPost(result).subscribe(() => {
            this.loadUserData();
          });
        }
      });
  }

  editPost(post: Post) {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '400px',
      data: { isEditing: true },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result: { price: number }) => {
        if (result) {
          this.apiService
            .editPost(post.id, { price: result.price })
            .subscribe(() => {
              this.loadUserData();
            });
        }
      });
  }

  buyPost(id: string) {
    this.apiService
      .buyPost(id)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => {
          this.loadUserData();
          this.balanceChangeService.balanceChanged();
        },
        error: (e) => {
          if (e.error && e.error.message) {
            this.notificationService.error(e.error.message);
          } else {
            this.notificationService.error('An unknown error occurred');
          }
        },
      });
  }

  transferBalance(userId: string) {
    const context: TransferModalContext = {
      title: '$$$ Transfer some dope $$$',
      buttonLabel: 'Transfer',
    };
    const dialogRef = this.dialog.open(TransferModalComponent, {
      width: '400px',
      data: context,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result: { amount: number }) => {
        if (result && result.amount) {
          this.apiService
            .transferDope({ recipient: userId, amount: result.amount })
            .subscribe({
              next: () => {
                this.notificationService.success('Transfer succesfull');
                this.balanceChangeService.balanceChanged();
              },
              error: (e) => {
                if (e.error && e.error.message) {
                  this.notificationService.error(e.error.message);
                } else {
                  this.notificationService.error('An unknown error occurred');
                }
              },
            });
        }
      });
  }

  withdraw() {
    const context: TransferModalContext = {
      title: '$$$ Withdraw some dope $$$',
      buttonLabel: 'Withdraw',
    };
    const dialogRef = this.dialog.open(TransferModalComponent, {
      width: '400px',
      data: context,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result: { amount: number }) => {
        if (result && result.amount) {
          this.apiService.withdrawDope({ amount: result.amount }).subscribe({
            next: () => {
              this.notificationService.success('Withdraw succesfull');
              this.balanceChangeService.balanceChanged();
            },
            error: (e) => {
              if (e.error && e.error.message) {
                this.notificationService.error(e.error.message);
              } else {
                this.notificationService.error('An unknown error occurred');
              }
            },
          });
        }
      });
  }

  deposit() {
    const context: TransferModalContext = {
      title: '$$$ Deposit some dope $$$',
      buttonLabel: 'Deposit',
    };
    const dialogRef = this.dialog.open(TransferModalComponent, {
      width: '400px',
      data: context,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result: { amount: number }) => {
        if (result && result.amount) {
          this.apiService.depositDope({ amount: result.amount }).subscribe({
            next: () => {
              this.notificationService.success('Deposit succesfull');
              this.balanceChangeService.balanceChanged();
            },
            error: (e) => {
              if (e.error && e.error.message) {
                this.notificationService.error(e.error.message);
              } else {
                this.notificationService.error('An unknown error occurred');
              }
            },
          });
        }
      });
  }
}
