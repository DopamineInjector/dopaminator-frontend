import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';
import {
  combineLatestWith,
  map,
  mergeWith,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Auction, GetBalanceResponse } from '../../types';
import { AuctionComponent } from '../../components/auction/auction.component';
import { StringLiteral } from 'typescript';

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
    AuctionComponent,
  ],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent implements OnInit {
  searchedText = new FormControl<string>('');

  componentDestroyed$ = new Subject<void>();

  auctions$!: Observable<Auction[]>;

  username!: string;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = history.state.username;
    this.auctions$ = this.apiService.getAuctions().pipe(
      combineLatestWith(this.valueChangesWithInitialValue(this.searchedText)),
      map(([auctions, searchedText]) =>
        auctions.filter((auction) =>
          auction.description.includes(searchedText ?? '')
        )
      )
    );
  }

  valueChangesWithInitialValue(
    control: FormControl<string | null>
  ): Observable<string | null> {
    return control.valueChanges.pipe(mergeWith(of(control.value)));
  }
}
