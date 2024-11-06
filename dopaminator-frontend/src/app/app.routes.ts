import { Routes } from '@angular/router';
import { MainPageComponent } from './views/main-page/main-page.component';
import { SlotsPageComponent } from './views/slots-page/slots-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { AccountPageComponent } from './views/account-page/account-page.component';
import { NotFoundPageComponent } from './views/not-found-page/not-found-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'slots', component: SlotsPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'account/:username', component: AccountPageComponent },
  { path: '404', component: NotFoundPageComponent },
  { path: '**', redirectTo: '/404' }
];
