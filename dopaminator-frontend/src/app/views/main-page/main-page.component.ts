import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [RouterOutlet, CardComponent, CommonModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  imageUrl$!: Observable<string>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.imageUrl$ = this.apiService.getMainPageImg();
  }
}
