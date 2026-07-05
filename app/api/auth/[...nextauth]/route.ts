import NextAuth from "next-auth";
// 🚀 FIX: Auth options ko central lib file se import kar rahe hain
import { authOptions } from "@/lib/auth"; 

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };