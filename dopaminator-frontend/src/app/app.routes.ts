import { Routes } from '@angular/router';
import { MainPageComponent } from './views/main-page/main-page.component';
import { SlotsPageComponent } from './views/slots-page/slots-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { Views } from './types';
import { SignupPageComponent } from './views/signup-page/signup-page.component';
import { AccountPageComponent } from './views/account-page/account-page.component';
import { NotFoundPageComponent } from './views/not-found-page/not-found-page.component';
import { StockPageComponent } from './views/stock-page/stock-page.component';

export const routes: Routes = [
  { path: Views.MAIN_PAGE, component: MainPageComponent },
  { path: Views.SLOTS_PAGE, component: SlotsPageComponent },
  { path: Views.LOGIN_PAGE, component: LoginPageComponent },
  { path: Views.SIGNUP_PAGE, component: SignupPageComponent },
  { path: Views.ACCOUNT_PAGE, component: AccountPageComponent },
  { path: Views.STOCK_PAGE, component: StockPageComponent },
  { path: Views.NOT_FOUND_PAGE, component: NotFoundPageComponent },
  { path: '**', redirectTo: '/404' },
];
