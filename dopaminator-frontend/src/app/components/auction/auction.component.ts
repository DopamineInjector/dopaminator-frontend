import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Component, Input, OnDestroy } from '@angular/core';
import { Auction, Views } from '../../types';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Router, RouterModule } from '@angular/router';
import { BalanceChangeService } from '../../services/balanceChange.service';

@Component({
  selector: 'auction',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.scss',
})
export class AuctionComponent implements OnDestroy {
  @Input() auction!: Auction;
  @Input() isMine!: boolean;
  @Input() username!: string;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router,
    private balanceChangedService: BalanceChangeService
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  buy() {
    this.apiService
      .buyNft(this.auction)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => {
          this.balanceChangedService.balanceChanged();
          this.notificationService.success('NFT bought');
          this.router.navigate([Views.STOCK_PAGE], {
            state: { username: this.username },
          });
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
}
