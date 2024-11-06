import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SpinResponse,
} from '../types';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoggedIn$ = new Subject<boolean>();

  private baseUrl = 'http://localhost:5264/api/users';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  signup(body: SignupRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/signup`, body)
      .pipe(tap((response) => this.setCredentials(response)));
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, body)
      .pipe(tap((response) => this.setCredentials(response)));
  }

  setCredentials(credentials: LoginResponse) {
    this.cookieService.set('token', credentials.token);
    this.cookieService.set('username', credentials.username);
    this.isLoggedIn$.next(true);
  }

  logout() {
    this.cookieService.delete('token');
    this.cookieService.delete('username');
    this.isLoggedIn$.next(false);
  }

  spin(): Observable<SpinResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<SpinResponse>(`${this.baseUrl}/spin`, { headers });
  }
}
