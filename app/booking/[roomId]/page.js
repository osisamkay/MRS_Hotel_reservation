'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNotification } from '@/src/contexts/NotificationContext';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';

export default function BookingPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });

  // Get booking parameters
  const { roomId } = params;
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  useEffect(() => {


    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch room details');
        }
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
        setError('Failed to load room details. Please try again.');
        showNotification('error', 'Failed to load room details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId, user, router, showNotification]);

  // Update form data when user data becomes available
  useEffect(() => {
    if (user) {
      setBookingData(prev => ({
        ...prev,
        firstName: user.firstName || user?.name?.split(' ')[0] || prev.firstName,
        lastName: user.lastName || user?.name?.split(' ')[1] || prev.lastName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const calculateTotalPrice = () => {
    if (!room) return 0;
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return room.price * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Store email in localStorage for payment page to use
      if (typeof window !== 'undefined') {
        console.log('Storing guest email in localStorage:', bookingData.email);

        // Store directly as a simple key-value pair
        localStorage.setItem('guestEmail', bookingData.email);

        // Also store in bookingState for compatibility
        const bookingState = localStorage.getItem('bookingState') || '{}';
        try {
          const parsedState = JSON.parse(bookingState);
          localStorage.setItem('bookingState', JSON.stringify({
            ...parsedState,
            email: bookingData.email
          }));
        } catch (e) {
          // If parsing fails, just create a new object
          localStorage.setItem('bookingState', JSON.stringify({
            email: bookingData.email
          }));
        }
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          checkIn,
          checkOut,
          guests: parseInt(guests),
          totalPrice: calculateTotalPrice(),
          // Include guest information for non-authenticated users
          guestName: `${bookingData.firstName} ${bookingData.lastName}`.trim(),
          guestEmail: bookingData.email,
          guestPhone: bookingData.phone,
          specialRequests: bookingData.specialRequests,
          // Skip availability check for confirmed bookings
          skipAvailabilityCheck: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      showNotification('success', 'Booking created successfully!');
      router.push(`/payment/${data.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking. Please try again.');
      showNotification('error', error.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="p-8 text-center">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-navy-700 rounded-full mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg inline-block">
            {error}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.back()}
              className="bg-navy-700 text-white px-4 py-2 rounded hover:bg-navy-800"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="p-8 text-center">
          <p className="text-xl font-semibold mb-4">Room not found</p>
          <button
            onClick={() => router.push('/rooms')}
            className="bg-navy-700 text-white px-4 py-2 rounded hover:bg-navy-800"
          >
            Browse Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <main className="py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      value={bookingData.firstName}
                      onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={bookingData.lastName}
                      onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    required
                    className="w-full p-2 border rounded"
                    placeholder="e.g. (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Special Requests</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    rows="4"
                    className="w-full p-2 border rounded"
                    placeholder="Any special requirements or requests for your stay?"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm py-2">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded font-bold ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-navy-700 hover:bg-navy-800 text-white'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-r-2 border-white rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>

              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-gray-600">{room.type}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Check-in</span>
                    <span>{new Date(checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Check-out</span>
                    <span>{new Date(checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Guests</span>
                    <span>{guests}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Price</span>
                    <span>${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
