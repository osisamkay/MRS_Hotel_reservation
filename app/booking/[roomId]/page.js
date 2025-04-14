'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';
import PageHeader from '@/src/components/PageHeader';
import BookingProcess from '@/src/components/BookingProcess';

export default function BookingPage({ params }) {
  const { roomId } = params;
  const searchParams = useSearchParams();
  const [initialDates, setInitialDates] = useState(null);
  
  useEffect(() => {
    // Get query parameters
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    
    if (checkIn && checkOut) {
      setInitialDates({
        checkIn,
        checkOut,
        guests: guests ? parseInt(guests, 10) : 1
      });
    }
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Book Your Stay</h1>
          
          <BookingProcess 
            roomId={roomId} 
            initialDates={initialDates} 
          />
        </div>
      </main>
      
      <footer className="py-6 bg-gray-800 text-white text-center mt-auto">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Moose Rock and Suites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}