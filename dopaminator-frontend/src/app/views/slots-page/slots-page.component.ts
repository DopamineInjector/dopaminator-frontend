import { Component, OnInit } from '@angular/core';
import { Fruits, SlotsSounds, SpinResponse } from '../../types';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card/card.component';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BigWinModalComponent } from '../../components/big-win-modal/big-win-modal.component';
import { BalanceChangeService } from '../../services/balanceChange.service';

@Component({
  selector: 'slots-page',
  standalone: true,
  imports: [CommonModule, CardComponent, MatButtonModule, MatDialogModule],
  templateUrl: './slots-page.component.html',
  styleUrl: './slots-page.component.scss',
})
export class SlotsPageComponent implements OnInit {
  spinAudio = new Audio();
  winAudio = new Audio();

  numberOfFruits = 7;
  loops = 10;
  fruitsIterator: Number[] = [];

  firstFruitPosition: number = 0;
  secondFruitPosition: number = 0;
  thirdFruitPosition: number = 0;

  firstFruitSpinTime: number = 0;
  secondFruitSpinTime: number = 0;
  thirdFruitSpinTime: number = 0;

  isSpinning: boolean = false;

  canSpin: boolean = true;

  protected Fruits = Fruits;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private balanceChangedService: BalanceChangeService
  ) {}

  ngOnInit(): void {
    this.fruitsIterator = Array(this.loops);
  }

  get firstFruitAnimation() {
    return this.isSpinning ? `${this.firstFruitSpinTime}s` : '0s';
  }

  get secondFruitAnimation() {
    return this.isSpinning ? `${this.secondFruitSpinTime}s` : '0s';
  }

  get thirdFruitAnimation() {
    return this.isSpinning ? `${this.thirdFruitSpinTime}s` : '0s';
  }

  spin() {
    this.canSpin = false;
    this.isSpinning = false;

    setTimeout(() => {
      this.randomizeSpinTimers();
      const maxSpinTime = Math.max(
        this.firstFruitSpinTime,
        this.secondFruitSpinTime,
        this.thirdFruitSpinTime
      );
      this.playSpinSound();
      this.apiService
        .spin()
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe({
          next: (result) => {
            this.balanceChangedService.balanceChanged();
            if (result.isWin) {
              this.setWinningPositions();
            } else {
              this.setRandomPositions();
            }
            this.isSpinning = true;
            setTimeout(() => {
              this.canSpin = true;
              if (result.isWin) {
                this.playWinSound();
                this.openBigWinModal(result);
              }
            }, maxSpinTime * 1000);
          },
          error: (e) => {
            if (e.error && e.error.message) {
              this.notificationService.error(e.error.message);
            } else {
              this.notificationService.error('An unknown error occurred');
            }
            this.canSpin = true;
          },
        });
    }, 50);
  }

  randomizeSpinTimers() {
    const fixedTimeFruitIdx = Math.floor(Math.random() * 3);
    this.firstFruitSpinTime =
      fixedTimeFruitIdx == 0 ? 9 : Math.floor(Math.random() * 6) + 3;
    this.secondFruitSpinTime =
      fixedTimeFruitIdx == 1 ? 9 : Math.floor(Math.random() * 6) + 3;
    this.thirdFruitSpinTime =
      fixedTimeFruitIdx == 2 ? 9 : Math.floor(Math.random() * 6) + 3;
  }

  setWinningPositions() {
    this.firstFruitPosition =
      Math.floor(Math.random() * this.numberOfFruits * (this.loops - 1)) +
      this.numberOfFruits;
    this.secondFruitPosition =
      (this.firstFruitPosition +
        Math.floor(Math.random() * 10) * this.numberOfFruits) %
      (this.numberOfFruits * this.loops);
    this.thirdFruitPosition =
      (this.firstFruitPosition +
        Math.floor(Math.random() * 10) * this.numberOfFruits) %
      (this.numberOfFruits * this.loops);
  }

  setRandomPositions() {
    this.firstFruitPosition =
      Math.floor(Math.random() * this.numberOfFruits * (this.loops - 1)) +
      this.numberOfFruits;
    this.secondFruitPosition =
      Math.floor(Math.random() * this.numberOfFruits * (this.loops - 1)) +
      this.numberOfFruits;
    this.thirdFruitPosition =
      Math.floor(Math.random() * this.numberOfFruits * (this.loops - 1)) +
      this.numberOfFruits;
  }

  openBigWinModal(result: SpinResponse) {
    this.dialog.open(BigWinModalComponent, {
      width: '400px',
      data: result,
    });
  }

  playSpinSound(): void {
    this.spinAudio.src = SlotsSounds.SPIN;
    this.spinAudio.load();
    this.spinAudio.play();
  }

  playWinSound(): void {
    this.winAudio.src = SlotsSounds.WIN;
    this.winAudio.load();
    this.winAudio.play();
  }
}
