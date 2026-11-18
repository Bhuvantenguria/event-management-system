import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dataStore } from "@/lib/data-store";
import { syncWithMongo } from "@/lib/db-sync";
import { sanitizeUrl } from "@/lib/utils";

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

        const inputEmail = credentials.email.trim().toLowerCase();
        const inputPassword = credentials.password;

        // 1. Direct Environment Variable Admin Login Check
        const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
        const envAdminPass = process.env.ADMIN_PASSWORD;

        if (envAdminEmail && envAdminPass && inputEmail === envAdminEmail && inputPassword === envAdminPass) {
          await syncWithMongo();
          let user = dataStore.getUserByEmail(envAdminEmail);
          if (!user) {
            user = dataStore.createUser({
              name: "Super Administrator",
              email: envAdminEmail,
              passwordHash: await bcrypt.hash(envAdminPass, 10),
              role: "super_admin",
              college: "Festival Central Secretariat",
              emailVerified: true,
            });
            await dataStore.flushPending();
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "super_admin",
            college: user.college,
            studentId: user.studentId,
          };
        }

        // 2. Default Seed Admin Credentials Check
        const defaultAdminEmails = [
          "admin@aiimsraebareli.edu.in",
          "admin@rangmanchfest.in",
          "admin@admin.com",
        ];
        if (defaultAdminEmails.includes(inputEmail) && inputPassword === "Admin@1234") {
          await syncWithMongo();
          let user = dataStore.getUserByEmail(inputEmail);
          if (!user) {
            user = dataStore.createUser({
              name: "Fest Administrator",
              email: inputEmail,
              passwordHash: await bcrypt.hash("Admin@1234", 10),
              role: "super_admin",
              college: "Festival Central Secretariat",
              emailVerified: true,
            });
            await dataStore.flushPending();
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: "super_admin",
            college: user.college,
            studentId: user.studentId,
          };
        }

        // 3. Hydrate from MongoDB Atlas for all registered users
        await syncWithMongo();

        const user = dataStore.getUserByEmail(inputEmail);
        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email. Please sign up.");
        }

        const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
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
    async redirect({ url, baseUrl }) {
      const prodUrl = "https://event-management-system-kappa-gold.vercel.app";
      const cleanEnv = sanitizeUrl(process.env.NEXTAUTH_URL);
      const cleanBase = sanitizeUrl(baseUrl);
      const rawUrl = url || "/";
      const cleanUrl = rawUrl.replace(/[\r\n\t\0\s]+/g, "").trim();

      const targetBase =
        cleanEnv && !cleanEnv.includes("localhost")
          ? cleanEnv
          : cleanBase && !cleanBase.includes("localhost")
          ? cleanBase
          : prodUrl;

      // Handle relative paths
      if (cleanUrl.startsWith("/")) {
        const full = `${targetBase}${cleanUrl}`;
        // Normalize any duplicate slashes between domain and path
        return full.replace(/([^:])\/{2,}/g, "$1/");
      }

      try {
        const urlObj = new URL(cleanUrl);
        const allowedHosts = [
          "event-management-system-kappa-gold.vercel.app",
          "event-management-system-theta-lac.vercel.app",
          new URL(targetBase).hostname,
        ];
        if (process.env.VERCEL_URL) {
          try {
            const vercelClean = sanitizeUrl(process.env.VERCEL_URL);
            allowedHosts.push(new URL(vercelClean.startsWith("http") ? vercelClean : `https://${vercelClean}`).hostname);
          } catch {}
        }
        if (allowedHosts.includes(urlObj.hostname)) {
          return cleanUrl;
        }
      } catch {}

      return `${targetBase}/`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "affinity-aiims-secret-key-2026-prod",
};
