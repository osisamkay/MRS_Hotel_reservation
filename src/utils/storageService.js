import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_PATH, 'users.json');

// Ensure the data directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Ensure the users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
}

// Helper function to read users
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return { users: [] };
  }
};

// Helper function to write users
const writeUsers = (data) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
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
      
      // Check if user already exists
      if (data.users.some(user => user.email === userData.email || user.userId === userData.userId)) {
        throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user object
      const newUser = {
        id: generateId(),
        email: userData.email,
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user',
        isActive: true
      };

      // Add user to database
      data.users.push(newUser);
      
      // Write updated data
      if (writeUsers(data)) {
        // Return user data without password
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      throw error;
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const data = readUsers();
    return data.users.find(user => user.email === email);
  },

  // Get user by ID
  getUserById: async (id) => {
    const data = readUsers();
    return data.users.find(user => user.id === id);
  },

  // Update user
  updateUser: async (id, updateData) => {
    try {
      const data = readUsers();
      const userIndex = data.users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      data.users[userIndex] = {
        ...data.users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      // Write updated data
      if (writeUsers(data)) {
        const { password, ...userWithoutPassword } = data.users[userIndex];
        return userWithoutPassword;
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
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