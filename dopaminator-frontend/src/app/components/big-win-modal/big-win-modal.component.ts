import { Component, Inject, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [CardComponent, CommonModule, MatButtonModule],
  templateUrl: './big-win-modal.component.html',
  styleUrl: './big-win-modal.component.scss',
})
export class BigWinModalComponent implements OnInit {
  image: string = '';
  name: string = '';
  constructor(
    public dialogRef: MatDialogRef<BigWinModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: string; name: string }
  ) {
    this.name = this.data.name;
    this.image = this.data.image;
    console.log(this.name);
  }

  ngOnInit() {}

  close(): void {
    this.dialogRef.close();
  }
}
