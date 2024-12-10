export interface GetBalanceResponse {
  blockchainBalance: number;
  depositBalance: number;
}

export interface Auction {
  id: number;
  userId: number;
  tokenId: number;
  description: string;
  price: number;
  image: Blob;
  username: string;
}

export interface TransferDopeRequest {
  amount: number;
  recipient: string;
}

export interface TransferModalContext {
  title: string;
  buttonLabel: string;
}

export interface BigWinModalContext {
  name: string;
  image: Blob;
  displaySellButton?: boolean;
}

export interface CreateAuctionRequest {
  tokenId: number;
  price: number;
  description: string;
}

export interface Nft {
  id: string;
  tokenId: number;
  description: string;
  image: Blob;
}

export interface GetNftsResponse {
  nfts: Nft[];
}

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

export interface FindUserResponse {
  exists: boolean;
}

export interface LoginResponse {
  username: string;
  token: string;
}

export interface GetUserResponse {
  id: string;
  username: string;
  posts: Post[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  price: number;
}

export interface EditPostRequest {
  price: number;
}

export interface Post {
  id: string;
  title: string;
  content: Blob;
  price: number;
  isOwned: boolean;
}

export interface SpinResponse {
  isWin: boolean;
  image: Blob;
  name: string;
}

export enum Views {
  MAIN_PAGE = '',
  LOGIN_PAGE = 'login',
  SLOTS_PAGE = 'slots',
  SIGNUP_PAGE = 'signup',
  ACCOUNT_PAGE = 'account',
  STOCK_PAGE = 'stock',
  NOT_FOUND_PAGE = '404',
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

export enum SlotsSounds {
  SPIN = '/sounds/spin.mp3',
  WIN = '/sounds/win.mp3',
}

const baseApiUrl = 'http://localhost:5264/api';

export enum Ednpoints {
  SIGNUP_ENDPOINT = `${baseApiUrl}/users/signup`,
  LOGIN_ENDPOINT = `${baseApiUrl}/users/login`,
  FIND_USER_ENDPOINT = `${baseApiUrl}/users/find`,
  GET_USER_ENDPOINT = `${baseApiUrl}/users/get`,
  GET_BALANCE_ENDPOINT = `${baseApiUrl}/blockchain/balance`,
  GET_USER_NFTS_ENDPOINT = `${baseApiUrl}/blockchain/nfts`,
  CREATE_AUCTION_ENDPOINT = `${baseApiUrl}/blockchain/sell`,
  TRANSFER_DOPE_ENDPOINT = `${baseApiUrl}/blockchain/transfer`,
  WITHDRAW_DOPE_ENDPOINT = `${baseApiUrl}/blockchain/withdraw`,
  DEPOSIT_DOPE_ENDPOINT = `${baseApiUrl}/blockchain/deposit`,
  BUY_NFT_ENDPOINT = `${baseApiUrl}/blockchain/buy`,
  GET_AUCTIONS_ENDPOINT = `${baseApiUrl}/blockchain/auctions`,
  SPIN_ENDPOINT = `${baseApiUrl}/gambling/spin`,
  CREATE_POST_ENDPOINT = `${baseApiUrl}/posts/create`,
  EDIT_POST_ENDPOINT = `${baseApiUrl}/posts/edit`,
  BUY_POST_ENDPOINT = `${baseApiUrl}/posts/buy`,
  MAIN_PAGE_IMG_ENDPOINT = `${baseApiUrl}/users/main`,
}
