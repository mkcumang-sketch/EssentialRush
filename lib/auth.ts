import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 🚀 FIX: '@' alias use kiya hai taaki lamba path na likhna pade
import connectDB from "@/lib/mongodb"; 
import User from "@/models/usertemp"; 

// 👑 VIP ADMIN EMAILS (Godmode Access)
const ADMIN_EMAILS = [
  "us7081569@gmail.com",
  "us7907us@gmail.com"
];

// 🚀 FIX: Sirf options export ho rahe hain, NextAuth handler nahi
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      await connectDB();
      // DB mein check karo user hai ya nahi, nahi toh create karo
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          role: ADMIN_EMAILS.includes(user.email as string) ? "SUPER_ADMIN" : "USER"
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        
        // 🚀 THE MAGIC: Hardcoded Check for VIPs
        if (ADMIN_EMAILS.includes(user.email as string)) {
          token.role = "SUPER_ADMIN";
        } else {
          // Normal user ke liye DB wala role ya default USER
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          token.role = dbUser?.role || "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        
        // 🚀 THE MAGIC: Session mein role inject karna
        if (ADMIN_EMAILS.includes(session.user.email as string)) {
          (session.user as any).role = "SUPER_ADMIN";
        } else {
          (session.user as any).role = token.role;
        }
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};