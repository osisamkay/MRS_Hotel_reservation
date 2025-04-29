// src/lib/auth.ts
import { DefaultSession, NextAuthOptions, getServerSession as getServerSessionBase } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }

  // Extend the built-in user types
  interface User {
    id: string;
    role: string;
    email: string;
    name: string;
    emailVerified: Date | null;
  }
}

// Type for the session returned by getServerSession
export interface AuthSession {
  user: {
    id: string;
    role: string;
    email: string;
    name: string;
    emailVerified: Date | null;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.emailVerified = token.emailVerified as Date | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

// Helper functions for authorization
export const isUserAdmin = (session: AuthSession | null): boolean => {
  return session?.user?.role === 'admin';
};
export const isUserSuperAdmin = (session: AuthSession | null): boolean => {
  return session?.user?.role === 'super_admin';
};

export const isUserStaff = (session: AuthSession | null): boolean => {
  return session?.user?.role === 'staff';
};

export const canManageBookings = (session: AuthSession | null, bookingUserId: string): boolean => {
  return isUserAdmin(session) || isUserSuperAdmin(session) || isUserStaff(session) || session?.user?.id === bookingUserId;
};

export const canViewDashboard = (session: AuthSession | null): boolean => {
  return isUserAdmin(session) || isUserSuperAdmin(session) || isUserStaff(session);
};

export const getServerSession = () => getServerSessionBase(authOptions);

// Type definitions for better TypeScript support
export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  emailVerified: boolean;
}