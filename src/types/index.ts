export interface User {
  provider: string;
  uid?: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  gender?: string;
  emailVerified?: boolean;
  age_range?: string;
  birthday?: string;
}
