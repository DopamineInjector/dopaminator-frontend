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
  GetBalanceResponse,
  GetUserResponse,
  Post,
  TransferModalContext,
} from '../types';
import { MatTabsModule } from '@angular/material/tabs';
import { UserInventoryComponent } from '../components/user-inventory/user-inventory.component';
import { TransferModalComponent } from '../components/transfer-modal/transfer-modal.component';
import { NotificationService } from '../services/notification.service';

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
    private notificationService: NotificationService
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
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result) => {
        if (result) {
          this.apiService
            .addPost({ title: result.title, content: result.content })
            .subscribe(() => {
              this.loadUserData();
            });
        }
      });
  }

  editPost(post: Post) {
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '400px',
      data: {
        title: post.title,
        content: post.content,
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result) => {
        if (result) {
          this.apiService
            .editPost(post.id, { title: result.title, content: result.content })
            .subscribe(() => {
              this.loadUserData();
            });
        }
      });
  }

  deletePost(id: number) {
    this.apiService
      .deletePost(id)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(() => {
        this.loadUserData();
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
              next: () =>
                this.notificationService.success('Transfer succesfull'),
              error: () =>
                this.notificationService.error(
                  'There was an error while processing your transfer'
                ),
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
            next: () => this.notificationService.success('Withdraw succesfull'),
            error: () =>
              this.notificationService.error(
                'There was an error while processing your withdraw'
              ),
          });
        }
      });
  }
}
