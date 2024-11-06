import { Component, OnInit } from '@angular/core';
import { UserAccountComponent } from '../../user-account/user-account.component';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-account-page',
  standalone: true,
  imports: [UserAccountComponent, NgIf],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss'
})
export class AccountPageComponent implements OnInit {
  username: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
  }

}
