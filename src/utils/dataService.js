import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear local storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw error;
  }
);

// User related operations
const userOperations = {
  // Get user profile
  getProfile: async () => {
    return await api.get('/users/profile');
  },

  // Update user profile
  updateProfile: async (data) => {
    return await api.put('/users/profile', data);
  },

  // Change password
  changePassword: async (data) => {
    return await api.post('/users/change-password', data);
  },
};

// Reservation related operations
const reservationOperations = {
  // Get all reservations for current user
  getUserReservations: async () => {
    return await api.get('/reservations/user');
  },

  // Get single reservation
  getReservation: async (id) => {
    return await api.get(`/reservations/${id}`);
  },

  // Create new reservation
  createReservation: async (data) => {
    return await api.post('/reservations', data);
  },

  // Update reservation
  updateReservation: async (id, data) => {
    return await api.put(`/reservations/${id}`, data);
  },

  // Cancel reservation
  cancelReservation: async (id) => {
    return await api.delete(`/reservations/${id}`);
  },
};

// Room related operations
const roomOperations = {
  // Get all available rooms
  getAvailableRooms: async (params) => {
    return await api.get('/rooms/available', { params });
  },

  // Get room details
  getRoomDetails: async (id) => {
    return await api.get(`/rooms/${id}`);
  },

  // Get room types
  getRoomTypes: async () => {
    return await api.get('/rooms/types');
  },
};

// Search and filter operations
const searchOperations = {
  // Search rooms with filters
  searchRooms: async (params) => {
    return await api.get('/search/rooms', { params });
  },

  // Get available dates for a room
  getAvailableDates: async (roomId) => {
    return await api.get(`/rooms/${roomId}/available-dates`);
  },
};

// Payment related operations
const paymentOperations = {
  // Create payment intent
  createPaymentIntent: async (data) => {
    return await api.post('/payments/create-intent', data);
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId) => {
    return await api.post('/payments/confirm', { paymentIntentId });
  },

  // Get payment history
  getPaymentHistory: async () => {
    return await api.get('/payments/history');
  },
};

// Review related operations
const reviewOperations = {
  // Get reviews for a room
  getRoomReviews: async (roomId) => {
    return await api.get(`/reviews/room/${roomId}`);
  },

  // Create review
  createReview: async (data) => {
    return await api.post('/reviews', data);
  },

  // Update review
  updateReview: async (id, data) => {
    return await api.put(`/reviews/${id}`, data);
  },

  // Delete review
  deleteReview: async (id) => {
    return await api.delete(`/reviews/${id}`);
  },
};

export const dataService = {
  user: userOperations,
  reservations: reservationOperations,
  rooms: roomOperations,
  search: searchOperations,
  payments: paymentOperations,
  reviews: reviewOperations,
  
  // Utility method to set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },

  // Utility method to clear all auth data
  clearAuth: () => {
    localStorage.clear();
  },
}; 