import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    role?: Role;
  }
}

const devAuthEnabled = process.env.AUTH_DEV_BYPASS === "true";
const credentialsEnabled = process.env.AUTH_CREDENTIALS_ENABLED !== "false";
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const hasMicrosoftEntraConfig = Boolean(
  process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID !== "your-azure-app-client-id" &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET !== "your-azure-app-client-secret" &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID !== "your-azure-tenant-id"
);

const providers = [];

const isEdgeRuntime =
  process.env.NEXT_RUNTIME === "edge" ||
  typeof (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime !== "undefined";

if (credentialsEnabled) {
  providers.push(
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const rawPassword = credentials?.password;

        if (typeof rawEmail !== "string" || typeof rawPassword !== "string") {
          return null;
        }

        const email = rawEmail.trim().toLowerCase();
        if (!email || !rawPassword) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, role: true, hashedPassword: true },
        });

        if (!user || !user.hashedPassword) return null;

        const valid = await bcrypt.compare(rawPassword, user.hashedPassword);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    })
  );
}

if (devAuthEnabled) {
  providers.push(
    Credentials({
      id: "dev-login",
      name: "Development Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;

        if (typeof rawEmail !== "string") {
          return null;
        }

        const email = rawEmail.trim().toLowerCase();

        if (!email || !email.endsWith("@plaksha.edu.in")) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, name: true, email: true, role: true },
        });

        if (!user) {
          return null;
        }

        return user;
      },
    })
  );
}

if (hasMicrosoftEntraConfig) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        },
      },
    })
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // First sign-in: set initial role from DB
        token.id = user.id!;
        token.role = user.role ?? "STUDENT";
        token.roleRefreshedAt = Date.now();
      } else if (token.id && !isEdgeRuntime) {
        // Refresh role from DB every 5 minutes to pick up admin-made role changes
        const lastRefresh = (token.roleRefreshedAt as number) ?? 0;
        if (Date.now() - lastRefresh > 5 * 60 * 1000) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
          token.roleRefreshedAt = Date.now();
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
    async signIn({ user, account }) {
      // For credentials providers, the authorize() function already validated the user.
      // For Microsoft Entra (OAuth), restrict to @plaksha.edu.in emails.
      if (account?.provider === "microsoft-entra-id") {
        if (!user.email || !user.email.endsWith("@plaksha.edu.in")) {
          return false;
        }
      }
      return true;
    },
  },
});
