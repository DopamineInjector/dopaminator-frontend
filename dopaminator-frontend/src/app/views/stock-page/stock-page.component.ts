import { Component, OnInit } from '@angular/core';
import { UserAccountComponent } from '../../user-account/user-account.component';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stock-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    CardComponent,
  ],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent implements OnInit {
  username: string | null = '';

  searchedUsernameControl = new FormControl<string>('');

  displayNoUserError: boolean = false;

  componentDestroyed$ = new Subject<void>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = history.state.username;
  }

  searchUser(): void {
    this.apiService
      .findUser({ username: this.searchedUsernameControl.value! })
      .subscribe((exists) => {
        this.displayNoUserError = !exists;
        if (exists) {
          this.username = this.searchedUsernameControl.value!;
        }
      });
  }
}
