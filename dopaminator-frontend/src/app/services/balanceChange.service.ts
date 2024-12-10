import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceChangeService {
  balanceChanged$ = new Subject<void>();

  balanceChanged() {
    this.balanceChanged$.next();
  }

  getBalanceChanged$() {
    return this.balanceChanged$.asObservable();
  }
}
