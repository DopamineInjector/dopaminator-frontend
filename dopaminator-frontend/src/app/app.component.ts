import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  userName: string = '';
  
  users = ['dopaminator69'];

  constructor(private router: Router) {}

  searchUser(searchedUser: string) {
    if (this.users.includes(searchedUser.toLowerCase())) {
      this.router.navigate(['/account', searchedUser]);
    } else {
      this.router.navigate(['/404']);
    }
  }
}
