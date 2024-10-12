import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'slots-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './slots-page.component.html',
  styleUrl: './slots-page.component.scss',
})
export class SlotsPageComponent {}
