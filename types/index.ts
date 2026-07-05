export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface ReferralApplyResponse {
  discount: number;
  referrerBonus: number;
  referralCode: string;
  newWalletBalance: number;
}

export interface Notification {
  title: string;
  desc: string;
  unread: boolean;
  time: Date;
}