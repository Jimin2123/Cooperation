export interface UserInfo {
  provider?: string;
  userID?: string | number | null; // 고유 아이디
  userEmail?: string | null;
  userName?: string | null;
  userNickName?: string | null;
  profile_image_url?: string | null;
  userGrade?: string | null;
  userAge?: number | null;
  address?: string | null;
  connected_at?: string | Date | null;
  gender?: string | null;
  emailVerified?: boolean;
}

export interface Account {
  account: string;
  password: string;
  check?: boolean;
}
