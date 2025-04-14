import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Data file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const ROOMS_FILE = path.join(DATA_DIR, 'rooms.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

/**
 * Helper function to read a JSON file
 */
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

/**
 * Helper function to write to a JSON file
 */
async function writeJsonFile(filePath, data) {
  try {
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Unified data service for all storage operations
 */
export const dataService = {
  // Room operations
  getAllRooms: async () => {
    return await readJsonFile(ROOMS_FILE);
  },
  
  getRoomById: async (id) => {
    const rooms = await readJsonFile(ROOMS_FILE);
    return rooms.find(room => room.id === id) || null;
  },
  
  getRoomAvailability: async (checkIn, checkOut, roomId = null) => {
    const rooms = await readJsonFile(ROOMS_FILE);
    const bookings = await readJsonFile(BOOKINGS_FILE);
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Filter bookings that overlap with the requested period
    const overlappingBookings = bookings.filter(booking => {
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);
      
      return (
        (bookingCheckIn < checkOutDate && bookingCheckOut > checkInDate) &&
        (roomId ? booking.roomId === roomId : true) &&
        booking.status !== 'cancelled'
      );
    });
    
    if (roomId) {
      // Check availability for a specific room
      const isAvailable = !overlappingBookings.some(b => b.roomId === roomId);
      return { available: isAvailable };
    } else {
      // Check availability for all rooms
      const bookedRoomIds = overlappingBookings.map(b => b.roomId);
      const availableRooms = rooms.filter(room => !bookedRoomIds.includes(room.id));
      return availableRooms;
    }
  },
  
  createRoom: async (roomData) => {
    const rooms = await readJsonFile(ROOMS_FILE);
    const newRoom = {
      id: roomData.id || `room${rooms.length + 1}`,
      ...roomData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    rooms.push(newRoom);
    await writeJsonFile(ROOMS_FILE, rooms);
    return newRoom;
  },
  
  updateRoom: async (id, roomData) => {
    const rooms = await readJsonFile(ROOMS_FILE);
    const index = rooms.findIndex(room => room.id === id);
    
    if (index === -1) {
      throw new Error(`Room with id ${id} not found`);
    }
    
    const updatedRoom = {
      ...rooms[index],
      ...roomData,
      updatedAt: new Date().toISOString()
    };
    
    rooms[index] = updatedRoom;
    await writeJsonFile(ROOMS_FILE, rooms);
    return updatedRoom;
  },
  
  deleteRoom: async (id) => {
    const rooms = await readJsonFile(ROOMS_FILE);
    const filteredRooms = rooms.filter(room => room.id !== id);
    
    if (rooms.length === filteredRooms.length) {
      throw new Error(`Room with id ${id} not found`);
    }
    
    await writeJsonFile(ROOMS_FILE, filteredRooms);
    return { success: true };
  },
  
  // Booking operations
  getAllBookings: async () => {
    return await readJsonFile(BOOKINGS_FILE);
  },
  
  getBookingById: async (id) => {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    return bookings.find(booking => booking.id === id) || null;
  },
  
  getBookingsByUser: async (userId) => {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    return bookings.filter(booking => booking.userId === userId);
  },
  
  getRecentBookings: async (limit = 5) => {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    return bookings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },
  
  createBooking: async (bookingData) => {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    
    // Check room availability
    const { available } = await dataService.getRoomAvailability(
      bookingData.checkIn, 
      bookingData.checkOut,
      bookingData.roomId
    );
    
    if (!available) {
      throw new Error('Room is not available for the selected dates');
    }
    
    const newBooking = {
      id: bookingData.id || `booking${uuidv4()}`,
      ...bookingData,
      status: bookingData.status || 'pending',
      paymentStatus: bookingData.paymentStatus || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    await writeJsonFile(BOOKINGS_FILE, bookings);
    return newBooking;
  },
  
  updateBooking: async (id, bookingData) => {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    const index = bookings.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    const updatedBooking = {
      ...bookings[index],
      ...bookingData,
      updatedAt: new Date().toISOString()
    };
    
    bookings[index] = updatedBooking;
    await writeJsonFile(BOOKINGS_FILE, bookings);
    return updatedBooking;
  },
  
  cancelBooking: async (id) => {
    const bookings = await readJsonFile(BOOKINGS_FILE);
    const index = bookings.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    bookings[index].status = 'cancelled';
    bookings[index].updatedAt = new Date().toISOString();
    
    await writeJsonFile(BOOKINGS_FILE, bookings);
    return bookings[index];
  },
  
  // User operations
  getAllUsers: async () => {
    return await readJsonFile(USERS_FILE);
  },
  
  getUserById: async (id) => {
    const users = await readJsonFile(USERS_FILE);
    return users.find(user => user.id === id) || null;
  },
  
  getUserByEmail: async (email) => {
    const users = await readJsonFile(USERS_FILE);
    return users.find(user => user.email === email) || null;
  },
  
  createUser: async (userData) => {
    const users = await readJsonFile(USERS_FILE);
    
    // Check if email is already in use
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Email is already in use');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      id: userData.id || `user${uuidv4()}`,
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  
  updateUser: async (id, userData) => {
    const users = await readJsonFile(USERS_FILE);
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    let updatedUserData = { ...userData };
    
    // Hash password if provided
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedUserData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const updatedUser = {
      ...users[index],
      ...updatedUserData,
      updatedAt: new Date().toISOString()
    };
    
    users[index] = updatedUser;
    await writeJsonFile(USERS_FILE, users);
    
    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
  
  validateUser: async (email, password) => {
    const user = await dataService.getUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Dashboard operations
  getDashboardStats: async () => {
    const [rooms, bookings, users] = await Promise.all([
      readJsonFile(ROOMS_FILE),
      readJsonFile(BOOKINGS_FILE),
      readJsonFile(USERS_FILE)
    ]);
    
    const activeBookings = bookings.filter(booking => booking.status !== 'cancelled');
    const totalRevenue = activeBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    return {
      totalRooms: rooms.length,
      totalBookings: bookings.length,
      activeBookings: activeBookings.length,
      totalUsers: users.length,
      totalRevenue
    };
  },
  
  // Payment operations
  createPayment: async (paymentData) => {
    const payments = await readJsonFile(PAYMENTS_FILE);
    
    const newPayment = {
      id: paymentData.id || `payment${uuidv4()}`,
      ...paymentData,
      status: paymentData.status || 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    payments.push(newPayment);
    await writeJsonFile(PAYMENTS_FILE, payments);
    
    // Update booking payment status
    if (paymentData.bookingId) {
      await dataService.updateBooking(paymentData.bookingId, {
        paymentStatus: 'paid',
        status: 'confirmed'
      });
    }
    
    return newPayment;
  },
  
  getPaymentByBookingId: async (bookingId) => {
    const payments = await readJsonFile(PAYMENTS_FILE);
    return payments.find(payment => payment.bookingId === bookingId) || null;
  },
  
  // Review operations
  createReview: async (reviewData) => {
    const reviews = await readJsonFile(REVIEWS_FILE);
    
    const newReview = {
      id: reviewData.id || `review${uuidv4()}`,
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    await writeJsonFile(REVIEWS_FILE, reviews);
    return newReview;
  },
  
  getReviewsByRoomId: async (roomId) => {
    const reviews = await readJsonFile(REVIEWS_FILE);
    return reviews.filter(review => review.roomId === roomId);
  }
};

export default dataService;