'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  Calendar,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';

export default function MyBookingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/my-bookings');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      setBookings(data.bookings);
    } catch (error) {
      setError('Failed to load bookings. Please try again later.');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      // Update the booking status in the local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (error) {
      setError('Failed to cancel booking. Please try again later.');
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: 'Confirmed',
        className: 'bg-green-50 text-green-700'
      },
      cancelled: {
        icon: <XCircle className="h-5 w-5 text-red-500" />,
        text: 'Cancelled',
        className: 'bg-red-50 text-red-700'
      },
      pending: {
        icon: <Clock className="h-5 w-5 text-yellow-500" />,
        text: 'Pending',
        className: 'bg-yellow-50 text-yellow-700'
      }
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`flex items-center px-3 py-1 rounded-full text-sm ${badge.className}`}>
        {badge.icon}
        <span className="ml-2">{badge.text}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4">
                <Image
                  src="/assets/images/no-bookings.svg"
                  alt="No bookings"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Bookings Found
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't made any bookings yet. Start by searching for available rooms.
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-mrs-blue text-white px-6 py-2 rounded-md hover:bg-navy-800"
              >
                Search Rooms
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {booking.room.name}
                      </h2>
                      <p className="text-gray-600">{booking.room.type}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>{booking.guests} Guest(s), {booking.roomCount} Room(s)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>Total: ${booking.payment.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <button
                      onClick={() => router.push(`/booking/${booking.id}`)}
                      className="text-mrs-blue hover:text-navy-800 font-medium flex items-center"
                    >
                      View Details
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 