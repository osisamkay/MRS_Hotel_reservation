import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Sample room data - in a real application, this would come from a database
const sampleRooms = [
  {
    id: '1',
    name: 'Deluxe Room',
    description: 'Spacious room with king-size bed and city view',
    price: 200,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
    available: true
  },
  {
    id: '2',
    name: 'Executive Suite',
    description: 'Luxurious suite with separate living area',
    price: 350,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchenette'],
    images: ['https://images.unsplash.com/photo-1566669437685-5d0c0a1b0e8a'],
    available: true
  },
  {
    id: '3',
    name: 'Family Room',
    description: 'Perfect for families with children',
    price: 280,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Crib'],
    images: ['https://images.unsplash.com/photo-1566669437685-5d0c0a1b0e8a'],
    available: true
  }
];

// In-memory storage for development
let bookings = [];
let users = [];
let payments = [];
let reviews = [];

/**
 * Unified data service for all storage operations
 */
export const dataService = {
  // Room operations
  getAllRooms: async () => {
    return sampleRooms;
  },

  getRoomById: async (id) => {
    return sampleRooms.find(room => room.id === id);
  },

  getRoomAvailability: async (checkIn, checkOut) => {
    // In a real application, this would check against actual bookings
    return sampleRooms;
  },

  // Booking operations
  createBooking: async (bookingData) => {
    const newBooking = {
      id: uuidv4(),
      ...bookingData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    bookings.push(newBooking);
    return newBooking;
  },

  getBookingById: async (id) => {
    return bookings.find(booking => booking.id === id);
  },

  getUserBookings: async (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  },

  // User operations
  createUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  getUserByEmail: async (email) => {
    return users.find(user => user.email === email);
  },

  verifyUser: async (email, password) => {
    const user = await dataService.getUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Payment operations
  createPayment: async (paymentData) => {
    const newPayment = {
      id: uuidv4(),
      ...paymentData,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
    payments.push(newPayment);
    return newPayment;
  },

  getPaymentById: async (id) => {
    return payments.find(payment => payment.id === id);
  },

  // Review operations
  createReview: async (reviewData) => {
    const newReview = {
      id: uuidv4(),
      ...reviewData,
      createdAt: new Date().toISOString(),
      status: 'published'
    };
    reviews.push(newReview);
    return newReview;
  },

  getRoomReviews: async (roomId) => {
    return reviews.filter(review => review.roomId === roomId);
  }
};