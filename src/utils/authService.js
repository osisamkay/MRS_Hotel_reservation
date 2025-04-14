'use client';

import { dataService } from './dataService';
import bcrypt from 'bcryptjs';

// User roles
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export const authService = {
  // Register new user
  register: async (userData) => {
    // Check if user exists
    const existingUser = await dataService.findUser({
      $or: [
        { email: userData.email },
        { userId: userData.userId }
      ]
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const newUser = {
      ...userData,
      password: hashedPassword,
      role: UserRole.USER, // Default role
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString()
    };

    await dataService.addUser(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Login user
  login: async (credentials) => {
    const user = await dataService.findUser({
      $or: [
        { userId: credentials.userId },
        { email: credentials.userId }
      ]
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Create session
    const sessionId = await dataService.createSession({
      userId: user.id,
      userAgent: window.navigator.userAgent
    });

    // Return user without password and session ID
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, sessionId };
  },

  // Logout user
  logout: async (sessionId) => {
    if (sessionId) {
      await dataService.deleteSession(sessionId);
    }
  },

  // Get current user
  getCurrentUser: async (sessionId) => {
    if (!sessionId) return null;

    const session = await dataService.getSession(sessionId);
    if (!session || new Date(session.expiresAt) < new Date()) {
      if (session) {
        await dataService.deleteSession(sessionId);
      }
      return null;
    }

    const user = await dataService.findUser({ id: session.userId });
    if (!user) {
      await dataService.deleteSession(sessionId);
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Update user profile
  updateProfile: async (userId, updateData) => {
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await dataService.updateUser(userId, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const user = await dataService.findUser({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const token = await dataService.createResetToken({
      userId: user.id,
      email: user.email
    });

    return token;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const tokenData = await dataService.validateResetToken(token);
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await dataService.updateUser(tokenData.userId, {
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });

    await dataService.deleteResetToken(token);
    return true;
  },

  // Check if user has required role
  hasRole: (user, requiredRole) => {
    if (!user || !user.role) return false;
    
    const roleHierarchy = {
      [UserRole.SUPER_ADMIN]: 3,
      [UserRole.ADMIN]: 2,
      [UserRole.USER]: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }
}; 