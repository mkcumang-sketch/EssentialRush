import type { DefaultSession, DefaultUser } from "next-auth";

// 🔧 Extend the default Session type
declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email: string;
      name: string;
      role: "USER" | "ADMIN" | "SUPER_ADMIN";
      phone?: string;
      walletBalance?: number;
      referralCode?: string;
      isVerified?: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    phone?: string;
    walletBalance?: number;
    referralCode?: string;
    isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "ADMIN" | "SUPER_ADMIN";
    phone?: string;
    walletBalance?: number;
    referralCode?: string;
  }
}

// 🔧 Helper type for safer session access
export type SessionUser = NonNullable<Session["user"]>;
export type UserRole = SessionUser["role"];

// 🔧 Type guard for role checking
export function isAdmin(role?: UserRole): role is "ADMIN" | "SUPER_ADMIN" {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role?: UserRole): role is "SUPER_ADMIN" {
  return role === "SUPER_ADMIN";
}