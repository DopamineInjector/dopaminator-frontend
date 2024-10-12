export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  token: string;
}

export enum Views {
  MAIN_PAGE = '',
  LOGIN_PAGE = 'login',
  SLOTS_PAGE = 'slots',
  SIGNUP_PAGE = 'signup',
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
}
