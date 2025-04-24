// src/contexts/BookingContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BookingContextType, BookingState, Room } from '@/src/types/booking';

// Create default booking state
const defaultBookingState: BookingState = {
  checkIn: '',
  checkOut: '',
  guests: 1,
  rooms: 1,
  selectedRoom: null,
  paymentMethod: 'credit_card',
  specialRequests: '',
};

// Create Booking Context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create Booking Provider
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingState, setBookingState] = useState<BookingState>(defaultBookingState);
  
  // Initialize with values from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('bookingState');
      if (storedState) {
        try {
          const parsedState = JSON.parse(storedState);
          
          // Validate parsed state structure
          if (
            typeof parsedState === 'object' && 
            parsedState !== null &&
            !Array.isArray(parsedState)
          ) {
            setBookingState(prevState => ({
              ...prevState,
              ...parsedState,
              // Convert date strings back to Date objects if needed
              checkIn: parsedState.checkIn || prevState.checkIn,
              checkOut: parsedState.checkOut || prevState.checkOut,
            }));
          }
        } catch (error) {
          console.error('Error parsing stored booking state:', error);
          // Clear corrupted state
          localStorage.removeItem('bookingState');
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
  const updateBookingState = (newState: Partial<BookingState>) => {
    setBookingState(prevState => ({
      ...prevState,
      ...newState
    }));
  };
  
  // Reset booking state
  const resetBookingState = () => {
    setBookingState(defaultBookingState);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bookingState');
    }
  };
  
  // Set selected room
  const selectRoom = (room: Room) => {
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
export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  
  return context;
}

export default BookingContext;