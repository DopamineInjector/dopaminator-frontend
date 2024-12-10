import { Component, Inject, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BigWinModalContext } from '../../types';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'big-win-modal',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './big-win-modal.component.html',
  styleUrl: './big-win-modal.component.scss',
})
export class BigWinModalComponent implements OnInit {
  price = new FormControl<number>(0);
  image: Blob;
  name: string = '';
  displaySellButton: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<BigWinModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BigWinModalContext,
    private notificationsService: NotificationService
  ) {
    this.name = this.data.name;
    this.image = this.data.image;
    this.displaySellButton = !!this.data.displaySellButton;
  }

  ngOnInit() {}

  close(): void {
    this.dialogRef.close(undefined);
  }

  createAuction(): void {
    if (this.price.value == null || this.price.value < 0) {
      this.notificationsService.error('Price must be positive number');
    }
    this.dialogRef.close({ price: this.price.value });
  }
}
