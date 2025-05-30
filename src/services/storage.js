import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

class StorageService {
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }

  async readJsonFile(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading file ${filename}:`, error);
      return [];
    }
  }

  async writeJsonFile(filename, data) {
    try {
      const filePath = path.join(this.dataDir, filename);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error writing file ${filename}:`, error);
      throw error;
    }
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Booking methods
  async getBookingsByRoom(roomId) {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      return bookings.filter(booking => booking.roomId === roomId);
    } catch (error) {
      console.error('Error getting bookings by room:', error);
      throw error;
    }
  }

  async getBookingsByUser(userId) {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      return bookings.filter(booking => booking.userId === userId);
    } catch (error) {
      console.error('Error getting bookings by user:', error);
      throw error;
    }
  }

  async createBooking(bookingData) {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      const newBooking = {
        id: this.generateId(),
        ...bookingData
      };
      bookings.push(newBooking);
      await this.writeJsonFile('bookings.json', bookings);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBooking(bookingId, updateData) {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      const index = bookings.findIndex(booking => booking.id === bookingId);

      if (index === -1) {
        throw new Error('Booking not found');
      }

      const updatedBooking = {
        ...bookings[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      bookings[index] = updatedBooking;
      await this.writeJsonFile('bookings.json', bookings);
      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async getBooking(bookingId) {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      const booking = bookings.find(booking => booking.id === bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      return booking;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      const index = bookings.findIndex(booking => booking.id === bookingId);

      if (index === -1) {
        throw new Error('Booking not found');
      }

      const updatedBooking = {
        ...bookings[index],
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      };

      bookings[index] = updatedBooking;
      await this.writeJsonFile('bookings.json', bookings);
      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async verifyCredentials(email, password) {
    try {
      const users = await this.readJsonFile('users.json');
      const user = users.find(u => u.email === email);

      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return null;
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      throw error;
    }
  }

  async getRooms() {
    try {
      const rooms = await this.readJsonFile('rooms.json');
      return rooms;
    } catch (error) {
      console.error('Error getting rooms:', error);
      throw error;
    }
  }

  async getRoom(roomId) {
    try {
      const rooms = await this.readJsonFile('rooms.json');
      const room = rooms.find(room => room.id === roomId);

      if (!room) {
        throw new Error('Room not found');
      }

      return room;
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  }

  async getAllBookings() {
    try {
      const bookings = await this.readJsonFile('bookings.json');
      return bookings;
    } catch (error) {
      console.error('Error getting all bookings:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const users = await this.readJsonFile('users.json');
      const user = users.find(user => user.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async createRoom(roomData) {
    try {
      const rooms = await this.readJsonFile('rooms.json');
      const newRoom = {
        id: this.generateId(),
        ...roomData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      rooms.push(newRoom);
      await this.writeJsonFile('rooms.json', rooms);
      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async updateRoom(roomId, updateData) {
    try {
      const rooms = await this.readJsonFile('rooms.json');
      const index = rooms.findIndex(room => room.id === roomId);

      if (index === -1) {
        throw new Error('Room not found');
      }

      const updatedRoom = {
        ...rooms[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      rooms[index] = updatedRoom;
      await this.writeJsonFile('rooms.json', rooms);
      return updatedRoom;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async deleteRoom(roomId) {
    try {
      const rooms = await this.readJsonFile('rooms.json');
      const index = rooms.findIndex(room => room.id === roomId);

      if (index === -1) {
        throw new Error('Room not found');
      }

      // Check if room has any active bookings
      const bookings = await this.readJsonFile('bookings.json');
      const hasActiveBookings = bookings.some(booking =>
        booking.roomId === roomId &&
        booking.status === 'confirmed' &&
        new Date(booking.checkOut) > new Date()
      );

      if (hasActiveBookings) {
        throw new Error('Cannot delete room with active bookings');
      }

      rooms.splice(index, 1);
      await this.writeJsonFile('rooms.json', rooms);
      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.readJsonFile('users.json');
      // Return users without password
      return users.map(({ password, ...user }) => user);
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async findUserByEmailOrUsername(email, username) {
    try {
      const users = await this.readJsonFile('users.json');
      return users.find(user =>
        user.email === email || user.username === username
      );
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const users = await this.readJsonFile('users.json');
      const newUser = {
        id: this.generateId(),
        ...userData
      };
      users.push(newUser);
      await this.writeJsonFile('users.json', users);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const users = await this.readJsonFile('users.json');
      const index = users.findIndex(user => user.id === userId);

      if (index === -1) {
        throw new Error('User not found');
      }

      users.splice(index, 1);
      await this.writeJsonFile('users.json', users);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService(); 