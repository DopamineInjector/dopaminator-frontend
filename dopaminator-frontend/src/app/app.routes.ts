import { Routes } from '@angular/router';
import { MainPageComponent } from './views/main-page/main-page.component';
import { SlotsPageComponent } from './views/slots-page/slots-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'slots', component: SlotsPageComponent },
  { path: 'login', component: LoginPageComponent },
];
