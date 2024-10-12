import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { SignupRequest, Views } from '../../types';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'signup-page',
  standalone: true,
  imports: [
    RouterOutlet,
    CardComponent,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss',
})
export class SignupPageComponent implements OnDestroy {
  signupForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  protected readonly Views = Views;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  getFormData(): SignupRequest {
    return {
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
      username: this.signupForm.controls.username.value,
    };
  }

  signup() {
    if (this.signupForm.invalid) {
      this.notificationService.error('Please fill all required fields');
      this.signupForm.markAllAsTouched();
      return;
    }
    this.apiService
      .signup(this.getFormData())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => {
          this.notificationService.success('User created succesfully');
          this.router.navigate([Views.MAIN_PAGE]);
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
