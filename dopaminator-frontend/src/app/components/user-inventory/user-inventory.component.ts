import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { EMPTY, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { GetNftsResponse, Nft, BigWinModalContext } from '../../types';
import { ApiService } from '../../services/api.service';
import { BigWinModalComponent } from '../big-win-modal/big-win-modal.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'user-inventory',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
  ],
  templateUrl: './user-inventory.component.html',
  styleUrls: ['./user-inventory.component.scss'],
  standalone: true,
})
export class UserInventoryComponent implements OnChanges, OnDestroy {
  @Input() username!: string;

  @Input() isMine: boolean = false;

  nfts$?: Observable<GetNftsResponse>;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      if (this.username) {
        this.nfts$ = this.apiService.getUserNfts(this.username);
      }
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  openBigWinModal(nft: Nft) {
    const context: BigWinModalContext = {
      image: nft.image,
      name: nft.description,
      displaySellButton: this.isMine,
    };
    const dialogRef = this.dialog.open(BigWinModalComponent, {
      width: '400px',
      data: context,
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result: { price: number }) => {
          if (result) {
            return this.apiService.createAuction({
              price: result.price,
              tokenId: nft.tokenId,
              description: nft.description,
            });
          }
          return EMPTY;
        }),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(() => {
        this.notificationService.success('Auction created');
      });
  }
}
