import CredentialsProvider from "next-auth/providers/credentials";
import { dataService } from "../services/dataService";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          
          // Validate user credentials
          const user = await dataService.validateUser(
            credentials.email,
            credentials.password
          );
          
          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Custom helper functions for authentication
export const isUserAdmin = (session) => {
  return session?.user?.role === 'admin' || session?.user?.role === 'super_admin';
};

export const isUserStaff = (session) => {
  return session?.user?.role === 'staff' || isUserAdmin(session);
};

export const canManageBookings = (session, bookingUserId) => {
  // Allow users to manage their own bookings or admins/staff to manage any booking
  return session?.user?.id === bookingUserId || isUserStaff(session);
};

export const canViewDashboard = (session) => {
  return isUserStaff(session);
};
