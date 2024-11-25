export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GetUserRequest {
  username: string;
}

export interface FindUserResponse{
  exists: boolean;
}

export interface LoginResponse {
  username: string;
  token: string;
}

export interface GetUserResponse {
  username: string;
  posts: [];
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

export interface SpinResponse {
  isWin: boolean;
}

export enum Views {
  MAIN_PAGE = '',
  LOGIN_PAGE = 'login',
  SLOTS_PAGE = 'slots',
  SIGNUP_PAGE = 'signup',
  NOT_FOUND_PAGE = '404'
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
}

export enum Fruits {
  BANANA = '/fruits/bannana.png',
  CHERRY = '/fruits/cherry.png',
  ORANGE = '/fruits/orange.png',
  PEER = '/fruits/peer.png',
  PINEAPPLE = '/fruits/pineapple.png',
  PLUM = '/fruits/plum.png',
  STRAWBERRY = '/fruits/strawberry.png',
}
