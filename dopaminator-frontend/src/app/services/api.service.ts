import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import {
  GetUserRequest,
  FindUserResponse,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SpinResponse,
  CreatePostRequest,
} from '../types';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoggedIn$ = new Subject<boolean>();

  private baseUrl = 'http://localhost:5264/api';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  signup(body: SignupRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/users/signup`, body)
      .pipe(tap((response) => this.setCredentials(response)));
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/users/login`, body)
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
    this.router.navigate(['']);
  }

  findUser(body: GetUserRequest): Observable<boolean> {
    return this.http
      .post<FindUserResponse>(`${this.baseUrl}/users/find`, body)
      .pipe(map((response) => response.exists));
  }

  getUser(body: GetUserRequest): Observable<GetUserResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<GetUserResponse>(`${this.baseUrl}/users/get`, body, {
      headers,
    });
  }

  getBalance(): Observable<number> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<{ balance: number }>(`${this.baseUrl}/users/balance`, { headers })
      .pipe(map((response) => response.balance));
  }

  spin(): Observable<SpinResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<SpinResponse>(`${this.baseUrl}/users/spin`, {
      headers,
    });
  }

  addPost(body: CreatePostRequest): Observable<boolean> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<boolean>(`${this.baseUrl}/posts/create`, body, {
      headers,
    });
  }

  editPost(id: number, body: CreatePostRequest): Observable<boolean> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<boolean>(`${this.baseUrl}/posts/edit/${id}`, body, {
      headers,
    });
  }

  deletePost(id: number): Observable<boolean> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<boolean>(`${this.baseUrl}/posts/delete/${id}`, {
      headers,
    });
  }

  getMainPageImg(): Observable<string> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    return this.http
      .get(`${this.baseUrl}/users/main`, { responseType: 'blob', headers })
      .pipe(map((blob) => URL.createObjectURL(blob)));
  }
}
