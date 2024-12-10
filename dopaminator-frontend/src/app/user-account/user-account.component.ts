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
import { GetUserResponse, Post } from '../types';
import { MatTabsModule } from '@angular/material/tabs';
import { UserInventoryComponent } from '../components/user-inventory/user-inventory.component';

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

  balance$: Observable<Number> | undefined;

  placeholderAvatar: string =
    'https://cdn0.iconfinder.com/data/icons/gambling-48/512/gambler-bet-gambling-casino-avatar-512.png';

  currentUser: boolean = false;

  componentDestroyed$ = new Subject<void>();

  constructor(
    private cookieService: CookieService,
    private apiService: ApiService,
    private dialog: MatDialog
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
}
