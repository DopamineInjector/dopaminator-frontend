import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import {
  findUserRequest,
  findUserResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SpinResponse,
} from '../types';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoggedIn$ = new Subject<boolean>();

  private baseUrl = 'http://localhost:5264/api/users';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

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
    console.log('funkcja api');
    const token = this.cookieService.get('token');
    if (token) {
      this.http.post(`${this.baseUrl}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).subscribe({
        next: () => {
          console.log("zajebiscie");
        },
        error: (err) => {
          console.error('Error during logout:', err);
        }
      });
    }
    this.cookieService.delete('token');
    this.cookieService.delete('username');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  findUser(body: findUserRequest): Observable<boolean> {
    return this.http
    .post<findUserResponse>(`${this.baseUrl}/find`, body)
    .pipe(map(response => response.exists));
  }

  spin(): Observable<SpinResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<SpinResponse>(`${this.baseUrl}/spin`, { headers });
  }

  getMainPageImg(): Observable<string> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    return this.http
      .get(`${this.baseUrl}/main`, { responseType: 'blob', headers })
      .pipe(map((blob) => URL.createObjectURL(blob)));
  }
}
