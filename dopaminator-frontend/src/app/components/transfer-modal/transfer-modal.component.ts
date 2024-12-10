import { Component, Inject, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { TransferModalContext } from '../../types';

@Component({
  selector: 'transfer-modal',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './transfer-modal.component.html',
  styleUrl: './transfer-modal.component.scss',
})
export class TransferModalComponent implements OnInit {
  amount = new FormControl<number>(0);
  constructor(
    public dialogRef: MatDialogRef<TransferModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransferModalContext,
    private notificationsService: NotificationService
  ) {}

  ngOnInit() {}

  close(): void {
    this.dialogRef.close(undefined);
  }

  transfer(): void {
    if (this.amount.value == null || this.amount.value < 0) {
      this.notificationsService.error('Amount must be a positive number');
    }
    this.dialogRef.close({ amount: this.amount.value });
  }
}
