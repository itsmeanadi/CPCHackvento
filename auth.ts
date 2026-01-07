import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getAdminDb } from "@/lib/firebase-admin";

const ADMIN_EMAILS = ["tpo@ietdavv.edu.in", "hod.cs@ietdavv.edu.in"];

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      if (!user?.email) return false;

      const isAllowedDomain = user.email.toLowerCase().endsWith("@ietdavv.edu.in");
      const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

      // 1. Strict Access Control
      if (!isAllowedDomain && !isAdmin) return false;

      try {
        const adminDb = getAdminDb();
        const userRef = adminDb.collection("users").doc(user.email);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
          // 2. Create New User (First Login)
          await userRef.set({
            name: user.name,
            email: user.email,
            image: user.image,
            role: isAdmin ? "admin" : "student",
            createdAt: new Date(),
            lastLogin: new Date(),
            // Student specific fields (empty initially)
            branch: "",
            cgpa: 0,
            isPlaced: false,
            resumeUrl: "",
            phone: "",
            githubUrl: "",
            linkedinUrl: "",
            isProfileComplete: false // Initially false for new users
          });
        } else {
          // 3. Update Existing User
          await userRef.update({
            lastLogin: new Date(),
            image: user.image // Keep profile pic synced with Google
          });
        }
        return true;
      } catch (error) {
        console.error("Firestore Error:", error);
        return false; // Deny login if DB fails
      }
    },
    async jwt({ token, user }: any) {
      if (user?.email) {
        // Update role based on email
        token.role = ADMIN_EMAILS.includes(user.email)
          ? "admin"
          : "student";
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  trustHost: true,
};

import { getServerSession } from "next-auth/next";

// Wrapper for getServerSession to verify/mock v5-like behavior
export const auth = () => getServerSession(authConfig);

// signIn and signOut are usually client-side in v4, so we don't export them for server use
// unless we want to implement server-side logic, but for now removing the v5 exports.

// Type augmentation for TypeScript
declare module "next-auth" {
  interface Session {
    user: {
      role: "admin" | "student";
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "student";
  }
}