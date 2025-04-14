'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BookingForm({ roomId, roomPrice }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(roomPrice || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Set default dates on component mount (today and tomorrow)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCheckInDate(formatDate(today));
    setCheckOutDate(formatDate(tomorrow));
  }, []);
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Calculate number of nights and total price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate && roomPrice) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      
      // Calculate the time difference in milliseconds
      const timeDiff = end.getTime() - start.getTime();
      
      // Calculate the number of nights
      const nightsCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (nightsCount > 0) {
        setNights(nightsCount);
        setTotalPrice(nightsCount * roomPrice);
      } else {
        setNights(1);
        setTotalPrice(roomPrice);
      }
    }
  }, [checkInDate, checkOutDate, roomPrice]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (status !== 'authenticated') {
      // Redirect to login page with callback
      router.push(`/login?callbackUrl=/booking/${roomId}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Navigate to booking page with parameters
      router.push(`/booking/${roomId}?checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`);
    } catch (error) {
      setError('Failed to process booking request. Please try again.');
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
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Check-in date */}
          <div>
            <label className="block text-gray-700 mb-2">Check-in:</label>
            <input
              type="date"
              required
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={formatDate(new Date())}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Check-out date */}
          <div>
            <label className="block text-gray-700 mb-2">Check-out:</label>
            <input
              type="date"
              required
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        {/* Number of guests */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Guests:</label>
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
        <div className="bg-white p-4 rounded mb-4">
          <div className="flex justify-between mb-2">
            <span>Price per night:</span>
            <span>${roomPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Number of nights:</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy-700 hover:bg-navy-800 text-white font-averia py-3 px-4 rounded transition-colors"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}