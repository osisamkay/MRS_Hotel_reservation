// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface SessionUser {
  id: string;
  role: string;
  email: string;
  name: string;
  emailVerified: Date | null;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  emailVerified: Date | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      const sessionUser = session.user as SessionUser;

      // Transform NextAuth session user to our app format
      const nameArray = (sessionUser.name || '').split(' ');
      const firstName = nameArray[0] || '';
      const lastName = nameArray.slice(1).join(' ') || '';

      setUser({
        id: sessionUser.id,
        firstName,
        lastName,
        email: sessionUser.email,
        role: sessionUser.role,
        emailVerified: sessionUser.emailVerified,
      });
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, [session, status]);

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;