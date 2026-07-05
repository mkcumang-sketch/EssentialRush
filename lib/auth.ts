// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose, { Model } from 'mongoose';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// ─── Extend next-auth types ───────────────────────────────────────────────────
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface User {
    id: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

// ─── User document interface ──────────────────────────────────────────────────
interface IAuthUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: string;
  myReferralCode?: string;
  referredBy?: string;
  walletPoints: number;
  notifications: unknown[];
}

// ─── Inline User Schema ───────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema<IAuthUser>(
  {
    name:           { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    password:       { type: String },
    role:           { type: String, default: 'USER' },
    myReferralCode: { type: String },
    referredBy:     { type: String },
    walletPoints:   { type: Number, default: 0 },
    notifications:  { type: Array, default: [] },
  },
  { timestamps: true }
);

// ✅ FIX: Explicitly type as Model<IAuthUser> — resolves ts(2349) union type error
const AuthUser: Model<IAuthUser> =
  (mongoose.models.User as Model<IAuthUser>) ||
  mongoose.model<IAuthUser>('User', UserSchema);

// ─── Auth Options ─────────────────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await AuthUser.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select('+password');

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password ?? ''
        );
        if (!isValid) return null;

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};