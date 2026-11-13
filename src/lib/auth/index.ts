import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Heritage Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        // Hydrate from MongoDB Atlas if configured
        await syncWithMongo();

        const user = dataStore.getUserByEmail(credentials.email);
        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email. Please sign up.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Incorrect password. Please verify and try again.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          college: user.college,
          studentId: user.studentId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.college = (user as any).college;
        token.studentId = (user as any).studentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).college = token.college;
        (session.user as any).studentId = token.studentId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "rangmanch-up-heritage-secret-key-2026-prod",
};
