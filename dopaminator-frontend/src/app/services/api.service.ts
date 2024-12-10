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
  GetNftsResponse,
  Ednpoints,
  CreateAuctionRequest,
  Auction,
  GetBalanceResponse,
  TransferDopeRequest,
  EditPostRequest,
} from '../types';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoggedIn$ = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  signup(body: SignupRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${Ednpoints.SIGNUP_ENDPOINT}`, body)
      .pipe(tap((response) => this.setCredentials(response)));
  }

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${Ednpoints.LOGIN_ENDPOINT}`, body)
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
      .post<FindUserResponse>(`${Ednpoints.FIND_USER_ENDPOINT}`, body)
      .pipe(map((response) => response.exists));
  }

  getUser(body: GetUserRequest): Observable<GetUserResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<GetUserResponse>(
      `${Ednpoints.GET_USER_ENDPOINT}`,
      body,
      {
        headers,
      }
    );
  }

  getBalance(): Observable<GetBalanceResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<GetBalanceResponse>(
      `${Ednpoints.GET_BALANCE_ENDPOINT}`,
      {
        headers,
      }
    );
  }

  getUserNfts(username: string): Observable<GetNftsResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<GetNftsResponse>(
      `${Ednpoints.GET_USER_NFTS_ENDPOINT}/${username}`,
      {
        headers,
      }
    );
  }

  getAuctions(): Observable<Auction[]> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Auction[]>(`${Ednpoints.GET_AUCTIONS_ENDPOINT}`, {
      headers,
    });
  }

  createAuction(request: CreateAuctionRequest): Observable<void> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<void>(
      `${Ednpoints.CREATE_AUCTION_ENDPOINT}`,
      request,
      {
        headers,
      }
    );
  }

  buyNft(auction: Auction): Observable<void> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<void>(Ednpoints.BUY_NFT_ENDPOINT, auction, {
      headers,
    });
  }

  spin(): Observable<SpinResponse> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<SpinResponse>(`${Ednpoints.SPIN_ENDPOINT}`, {
      headers,
    });
  }

  addPost(body: CreatePostRequest): Observable<boolean> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<boolean>(`${Ednpoints.CREATE_POST_ENDPOINT}`, body, {
      headers,
    });
  }

  editPost(id: string, body: EditPostRequest): Observable<boolean> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<boolean>(
      `${Ednpoints.EDIT_POST_ENDPOINT}/${id}`,
      body,
      {
        headers,
      }
    );
  }

  buyPost(id: string): Observable<void> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<void>(`${Ednpoints.BUY_POST_ENDPOINT}/${id}`, {
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
      .get(`${Ednpoints.MAIN_PAGE_IMG_ENDPOINT}`, {
        responseType: 'blob',
        headers,
      })
      .pipe(map((blob) => URL.createObjectURL(blob)));
  }

  transferDope(request: TransferDopeRequest): Observable<void> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<void>(
      `${Ednpoints.TRANSFER_DOPE_ENDPOINT}`,
      request,
      {
        headers,
      }
    );
  }

  withdrawDope(request: { amount: number }): Observable<void> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<void>(
      `${Ednpoints.WITHDRAW_DOPE_ENDPOINT}`,
      request,
      {
        headers,
      }
    );
  }

  depositDope(request: { amount: number }): Observable<void> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<void>(`${Ednpoints.DEPOSIT_DOPE_ENDPOINT}`, request, {
      headers,
    });
  }
}
