// app/booking/confirmation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import { CheckCircle, Calendar, Users, Clock, FileText, Printer, Share2, Mail, Home } from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetails {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  room: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
  payment?: {
    id: string;
    method: string;
    status: string;
  };
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const bookingId = searchParams.get('bookingId');
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!bookingId) {
      setError('Booking ID is missing');
      setLoading(false);
      return;
    }
    
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings?id=${bookingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to load booking details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, isAuthenticated, isLoading, router]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const calculateNights = () => {
    if (!booking) return 0;
    
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleShareBooking = () => {
    // Implement share functionality here (e.g., copy link to clipboard)
    if (navigator.share) {
      navigator.share({
        title: 'My Hotel Booking',
        text: `I've booked a room at Moose Rock and Suites!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Booking link copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="p-8 text-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-navy-700 border-r-2 rounded-full mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || 'Unable to find booking details'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-navy-700 text-white px-6 py-2 rounded hover:bg-navy-800"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your booking. Your reservation is confirmed.
            </p>
          </div>
          
          {/* Booking Reference */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Booking Reference</h2>
                <p className="text-gray-500">Booking ID: {booking.id}</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center text-navy-700 hover:text-navy-800"
                >
                  <Printer className="h-5 w-5 mr-1" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleShareBooking}
                  className="flex items-center text-navy-700 hover:text-navy-800"
                >
                  <Share2 className="h-5 w-5 mr-1" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Booking Details</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p>{formatDate(booking.checkIn)}, after 3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p>{formatDate(booking.checkOut)}, before 11:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p>{calculateNights()} nights</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Guests</p>
                      <p>{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Payment Status</p>
                      <p className="capitalize">{booking.payment?.status || 'Pending'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="capitalize">{booking.payment?.method?.replace('_', ' ') || 'Credit Card'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p>${booking.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={booking.room.images[0] || '/assets/images/room-placeholder.jpg'}
                    alt={booking.room.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-lg font-medium mb-2">{booking.room.name}</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy your stay in our comfortable and well-appointed room.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Price per night</p>
                    <p className="font-medium">${booking.room.price.toFixed(2)}</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Total (including taxes)</p>
                    <p className="font-medium">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-navy-100 rounded-full h-8 w-8 flex items-center justify-center text-navy-700 font-bold mr-3">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Check your email</h3>
                  <p className="text-gray-600">We've sent a confirmation email with all the details of your booking.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-navy-100 rounded-full h-8 w-8 flex items-center justify-center text-navy-700 font-bold mr-3">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Save your booking reference</h3>
                  <p className="text-gray-600">Keep your booking ID handy: {booking.id}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-navy-100 rounded-full h-8 w-8 flex items-center justify-center text-navy-700 font-bold mr-3">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Prepare for your stay</h3>
                  <p className="text-gray-600">Make sure to bring a valid ID for check-in.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center bg-navy-700 text-white px-6 py-3 rounded-md hover:bg-navy-800"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </button>
            
            <button
              onClick={() => router.push('/my-bookings')}
              className="flex items-center justify-center border border-navy-700 text-navy-700 px-6 py-3 rounded-md hover:bg-navy-50"
            >
              <FileText className="h-5 w-5 mr-2" />
              View All Bookings
            </button>
            
            <button
              onClick={() => window.location.href = `mailto:support@mooserock.com?subject=Booking%20${booking.id}`}
              className="flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-100"
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}