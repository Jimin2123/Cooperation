export interface UserInfo {
  provider: string;
  uid?: string; // 고유 아이디
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  gender?: string;
  emailVerified?: boolean;
  age_range?: string;
  birthday?: string;
}

export interface Account {
  account: string;
  password: string;
  check?: boolean;
}
