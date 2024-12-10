import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../services/notification.service';
import { CreatePostRequest } from '../types';
import { CardComponent } from '../components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-post-dialog',
  templateUrl: './add-post-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    CardComponent,
    CommonModule,
  ],
  styleUrls: ['./add-post-dialog.component.scss'],
  standalone: true,
})
export class AddPostDialogComponent {
  content: File | null = null;
  title = new FormControl<string>('', Validators.required);
  price = new FormControl<number>(0, Validators.required);
  isEditing = false;

  constructor(
    private dialogRef: MatDialogRef<AddPostDialogComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA)
    public data: { isEditing: boolean }
  ) {
    if (this.data?.isEditing) {
      this.isEditing = this.data.isEditing;
    }
  }

  onCancel(): void {
    this.dialogRef.close(undefined);
  }

  createPost(): void {
    if (
      (this.content && this.title.valid && this.price.valid) ||
      this.isEditing
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const response: CreatePostRequest = {
          content: base64Data.split(',')[1],
          title: this.title.value!,
          price: this.price.value!,
        };
        this.dialogRef.close(response);
      };
      reader.onerror = () => {
        this.notificationService.error('Error reading file!');
      };
      reader.readAsDataURL(this.content!);
      return;
    }
    this.notificationService.error('Fill all required data!');
  }

  editPost() {
    if (this.price.valid) {
      this.dialogRef.close({ price: this.price.value });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.content = input.files[0];
    }
  }
}
