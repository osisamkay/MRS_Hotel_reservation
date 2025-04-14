'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create Booking Context
const BookingContext = createContext({});

// Create Booking Provider
export function BookingProvider({ children }) {
  const [bookingState, setBookingState] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    selectedRoom: null,
  });
  
  // Initialize with values from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('bookingState');
      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          setBookingState(prevState => ({
            ...prevState,
            ...parsedState
          }));
        } catch (error) {
          console.error('Error parsing stored booking state:', error);
        }
      }
    }
  }, []);
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookingState', JSON.stringify(bookingState));
    }
  }, [bookingState]);
  
  // Update booking state
  const updateBookingState = (newState) => {
    setBookingState(prevState => ({
      ...prevState,
      ...newState
    }));
  };
  
  // Reset booking state
  const resetBookingState = () => {
    setBookingState({
      checkIn: '',
      checkOut: '',
      guests: 1,
      rooms: 1,
      selectedRoom: null,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bookingState');
    }
  };
  
  // Set selected room
  const selectRoom = (room) => {
    setBookingState(prevState => ({
      ...prevState,
      selectedRoom: room
    }));
  };
  
  return (
    <BookingContext.Provider
      value={{
        bookingState,
        updateBookingState,
        resetBookingState,
        selectRoom
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

// Create custom hook for using booking context
export function useBooking() {
  const context = useContext(BookingContext);
  
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  
  return context;
}

export default BookingContext;