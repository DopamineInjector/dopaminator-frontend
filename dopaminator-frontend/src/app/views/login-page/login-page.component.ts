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
import { LoginRequest, Views } from '../../types';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil } from 'rxjs';
import { BalanceChangeService } from '../../services/balanceChange.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    CardComponent,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnDestroy {
  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  protected readonly Views = Views;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private router: Router,
    private balanceChangeService: BalanceChangeService
  ) {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  getFormData(): LoginRequest {
    return {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    };
  }

  login() {
    if (this.loginForm.invalid) {
      this.notificationService.error('Please fill all required fields');
      this.loginForm.markAllAsTouched();
      return;
    }
    this.apiService
      .login(this.getFormData())
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe({
        next: () => {
          this.notificationService.success('Logged in succesfully');
          this.balanceChangeService.balanceChanged();
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
