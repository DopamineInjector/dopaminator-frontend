import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @Input() userName?: string;

  @Output() logIn = new EventEmitter<string>();

  @Output() logOut = new EventEmitter<void>();
}
