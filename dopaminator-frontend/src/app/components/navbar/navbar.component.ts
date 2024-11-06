import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() userName?: string;
  searchPhrase: string = "";

  @Output() logIn = new EventEmitter<string>();

  @Output() logOut = new EventEmitter<void>();

  constructor(private appComponent: AppComponent) {}

  search() {
    this.appComponent.searchUser(this.searchPhrase);
  }
}
