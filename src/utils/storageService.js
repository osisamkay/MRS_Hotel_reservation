import bcrypt from 'bcryptjs';

const STORAGE_KEY = 'users_data';

// Helper function to read users
const readUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { users: [] };
  } catch (error) {
    console.error('Error reading users:', error);
    return { users: [] };
  }
};

// Helper function to write users
const writeUsers = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
};

// Helper function to generate a unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const storageService = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const data = readUsers();
      const existingUser = data.users.find(user => user.email === userData.email);

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = {
        id: generateId(),
        ...userData,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      data.users.push(newUser);
      writeUsers(data);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const data = readUsers();
      return data.users.find(user => user.email === email);
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    const data = readUsers();
    return data.users.find(user => user.id === id);
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const data = readUsers();
      const userIndex = data.users.findIndex(user => user.id === userId);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      data.users[userIndex] = {
        ...data.users[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };

      writeUsers(data);
      return data.users[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const data = readUsers();
      const userIndex = data.users.findIndex(user => user.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Remove user
      data.users.splice(userIndex, 1);

      // Write updated data
      if (writeUsers(data)) {
        return true;
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      throw error;
    }
  },

  // Verify user credentials
  verifyCredentials: async (email, password) => {
    try {
      const user = await storageService.getUserByEmail(email);

      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return null;
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
};

export const passwordService = {
  // Generate reset token
  generateResetToken: () => {
    return generateId();
  },

  // Store reset token
  storeResetToken: async (email, token) => {
    try {
      const data = readUsers();
      const userIndex = data.users.findIndex(user => user.email === email);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      data.users[userIndex].resetToken = token;
      data.users[userIndex].resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour expiry
      writeUsers(data);
      return true;
    } catch (error) {
      console.error('Error storing reset token:', error);
      throw error;
    }
  },

  // Verify reset token
  verifyResetToken: async (email, token) => {
    try {
      const data = readUsers();
      const user = data.users.find(user => user.email === email);

      if (!user || !user.resetToken || !user.resetTokenExpiry) {
        return false;
      }

      if (user.resetToken !== token) {
        return false;
      }

      if (new Date(user.resetTokenExpiry) < new Date()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verifying reset token:', error);
      throw error;
    }
  }
}; 