'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useBooking } from '@/src/contexts/BookingContext';
import { addDays, formatISO, differenceInDays, isAfter, isBefore, format } from 'date-fns';
import { Calendar, Ban, CreditCard, User, Users } from 'lucide-react';
import { calculateTotalPrice } from '@/src/utils/bookingUtils';

interface BookingFormProps {
  roomId: string;
  roomPrice: number;
}

export default function BookingForm({ roomId, roomPrice }: BookingFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { bookingState, updateBookingState } = useBooking();
  const isAuthenticated = status === 'authenticated';
  
  // Default dates are today and tomorrow
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [checkInDate, setCheckInDate] = useState<string>(
    bookingState.checkIn || formatISO(today, { representation: 'date' })
  );
  const [checkOutDate, setCheckOutDate] = useState<string>(
    bookingState.checkOut || formatISO(tomorrow, { representation: 'date' })
  );
  const [guests, setGuests] = useState<number>(bookingState.guests || 2);
  const [nights, setNights] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(roomPrice);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  
  // Guest information fields
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showGuestFields, setShowGuestFields] = useState(false);
  
  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (date: Date): string => {
    return formatISO(date, { representation: 'date' });
  };
  
  // Update the booking context when dates or guests change
  useEffect(() => {
    if (checkInDate && checkOutDate && !dateError) {
      updateBookingState({
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests
      });
    }
  }, [checkInDate, checkOutDate, guests, dateError, updateBookingState]);
  
  // Calculate number of nights and total price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      try {
        const start = new Date(checkInDate);
        const end = new Date(checkOutDate);
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          setDateError('Invalid date format');
          return;
        }
        
        if (isBefore(end, start)) {
          setDateError('Check-out date must be after check-in date');
          return;
        }
        
        // Clear any previous error
        setDateError('');
        
        // Calculate nights and total price
        const nightsCount = differenceInDays(end, start);
        
        if (nightsCount > 0) {
          setNights(nightsCount);
          setTotalPrice(calculateTotalPrice(roomPrice, nightsCount));
        } else {
          setNights(1);
          setTotalPrice(roomPrice);
        }
      } catch (error) {
        console.error('Date calculation error:', error);
        setDateError('Invalid date format');
      }
    }
  }, [checkInDate, checkOutDate, roomPrice]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    if (dateError) {
      return;
    }
    
    // If not logged in, show guest fields
    if (!isAuthenticated && !showGuestFields) {
      setShowGuestFields(true);
      return;
    }

    // Validate guest information if not authenticated
    if (!isAuthenticated && showGuestFields) {
      if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
        setError('Please fill in all guest information fields');
        return;
      }
      
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create the booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests,
          totalPrice,
          ...(!isAuthenticated && {
            guestName: guestInfo.name,
            guestEmail: guestInfo.email,
            guestPhone: guestInfo.phone
          })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const booking = await response.json();
      
      // Navigate to payment page
      router.push(`/payment/${booking.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process booking request');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-navy-700">Book This Room</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Check-in date */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Check-in:
              </div>
            </label>
            <input
              type="date"
              required
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={formatDateForInput(today)}
              className={`w-full p-2 border rounded ${
                dateError && dateError.includes('check-in') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          
          {/* Check-out date */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Check-out:
              </div>
            </label>
            <input
              type="date"
              required
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || formatDateForInput(tomorrow)}
              className={`w-full p-2 border rounded ${
                dateError && !dateError.includes('check-in') ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
        
        {dateError && (
          <div className="mb-4 flex items-center text-red-600 text-sm">
            <Ban className="h-4 w-4 mr-2" />
            {dateError}
          </div>
        )}
        
        {/* Number of guests */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Guests:
            </div>
          </label>
          <input
            type="number"
            required
            value={guests}
            onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        {/* Price summary */}
        <div className="bg-white p-4 rounded mb-4 border border-gray-200">
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Price per night:</span>
            <span>${roomPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Number of nights:</span>
            <span>{nights}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">*Taxes and fees included</p>
          </div>
        </div>
        
        {showGuestFields && !isAuthenticated && (
          <div className="space-y-4">
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="guestName"
                value={guestInfo.name}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required={showGuestFields}
              />
            </div>
            <div>
              <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="guestEmail"
                value={guestInfo.email}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required={showGuestFields}
              />
            </div>
            <div>
              <label htmlFor="guestPhone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="guestPhone"
                value={guestInfo.phone}
                onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required={showGuestFields}
              />
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading || !!dateError}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isAuthenticated || showGuestFields ? 'Book Now' : 'Continue as Guest'}
          </button>
        </div>
      </form>
    </div>
  );
}