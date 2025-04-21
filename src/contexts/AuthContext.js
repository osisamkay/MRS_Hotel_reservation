'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from session on client side
  useEffect(() => {
    async function loadUserSession() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();

          if (session?.user) {
            // Transform NextAuth session user to our app format
            setUser({
              id: session.user.id,
              email: session.user.email,
              firstName: session.user.name?.split(' ')[0] || '',
              lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
              role: session.user.role || 'user',
            });
          }
        }
      } catch (error) {
        console.error('Failed to load user session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserSession();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Reload the session to get the updated user data
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const session = await response.json();

        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
            role: session.user.role || 'user',
          };
          setUser(userData);

          // Redirect based on user role
          if (userData.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to log in'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut({ redirect: false });
      setUser(null);
      window.location.href = '/'; // Redirect to home page
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback to manual redirect if signOut fails
      window.location.href = '/api/auth/signout?callbackUrl=/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;