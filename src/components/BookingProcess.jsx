'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Booking process component - combines room selection, guest info, and payment
export default function BookingProcess({ roomId, initialDates }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    roomId: roomId || '',
    checkIn: initialDates?.checkIn || '',
    checkOut: initialDates?.checkOut || '',
    guests: initialDates?.guests || 1,
    totalPrice: 0,
    specialRequests: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    nameOnCard: '',
  });

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();
  const { data: session, status } = useSession();

  // Fetch room details on component mount
  useEffect(() => {
    if (roomId) {
      fetchRoomDetails(roomId);
    }
  }, [roomId]);

  // Calculate price whenever dates or room changes
  useEffect(() => {
    if (room && bookingData.checkIn && bookingData.checkOut) {
      calculateTotalPrice();
    }
  }, [room, bookingData.checkIn, bookingData.checkOut, bookingData.guests]);

  // Fetch room details from API
  const fetchRoomDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rooms/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch room details');
      }

      const data = await response.json();
      setRoom(data.room);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Calculate the total price based on room rate and stay duration
  const calculateTotalPrice = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);

    // Calculate number of nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    if (nights > 0 && room?.price) {
      const totalPrice = nights * room.price;
      setBookingData(prev => ({ ...prev, totalPrice }));
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  // Handle room selection (step 1)
  const handleRoomSelection = (e) => {
    e.preventDefault();

    // Validate dates
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);

    if (checkIn >= checkOut) {
      setError('Check-out date must be after check-in date');
      return;
    }

    // Move to guest information step
    setError('');
    setStep(2);
  };

  // Handle guest information (step 2)
  const handleGuestInfo = (e) => {
    e.preventDefault();

    // Validate contact information
    if (!bookingData.contactName || !bookingData.contactEmail || !bookingData.contactPhone) {
      setError('Please fill in all contact information');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.contactEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    // Move to payment step
    setError('');
    setStep(3);
  };

  // Handle payment information (step 3)
  const handlePayment = async (e) => {
    e.preventDefault();

    // Simple validation for card details (in a real app, use a payment library)
    if (bookingData.paymentMethod === 'credit_card') {
      if (!bookingData.cardNumber || !bookingData.cardExpiry || !bookingData.cardCvc || !bookingData.nameOnCard) {
        setError('Please fill in all card details');
        return;
      }

      // Basic card number validation
      if (!/^\d{16}$/.test(bookingData.cardNumber.replace(/\s/g, ''))) {
        setError('Please enter a valid card number');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      // Ensure dates are in ISO format
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);

      // Validate dates
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        throw new Error('Invalid dates selected');
      }

      if (checkIn >= checkOut) {
        throw new Error('Check-out date must be after check-in date');
      }

      // Create booking first
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: bookingData.roomId,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests: bookingData.guests,
          totalPrice: bookingData.totalPrice,
          specialRequests: bookingData.specialRequests,
          // Always include guest information, which will be used for non-authenticated users
          guestName: bookingData.contactName,
          guestEmail: bookingData.contactEmail,
          guestPhone: bookingData.contactPhone,
          // Skip availability check for confirmed bookings
          skipAvailabilityCheck: true
        }),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }

      const responseData = await bookingResponse.json();

      // Process payment
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: responseData.id,
          amount: responseData.totalPrice,
          method: bookingData.paymentMethod,
          // Note: In a real app, you would use a secure payment gateway
          // and would not send card details directly to your server
          cardDetails: {
            last4: bookingData.cardNumber.slice(-4),
            expiryDate: bookingData.cardExpiry,
          },
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Failed to process payment');
      }

      // Show success message and redirect to payment page
      setSuccessMessage('Booking successful! Redirecting to payment page...');
      setTimeout(() => {
        router.push(`/payment/${responseData.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  // If session is loading, show loading state
  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>;
  }

  // No longer redirecting unauthenticated users to login

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Booking Steps Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-navy-700' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-navy-700 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="mt-2">Room Details</span>
          </div>
          <div className={`flex-grow border-t ${step >= 2 ? 'border-navy-700' : 'border-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-navy-700' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-navy-700 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="mt-2">Guest Information</span>
          </div>
          <div className={`flex-grow border-t ${step >= 3 ? 'border-navy-700' : 'border-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-navy-700' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-navy-700 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="mt-2">Payment</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg">Processing...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Step 1: Room Selection */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Room Details</h2>

          {room && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
              <p className="text-gray-600 mb-2">{room.description}</p>
              <p className="text-lg font-bold">${room.price} / night</p>
            </div>
          )}

          <form onSubmit={handleRoomSelection}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleInputChange}
                  className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleInputChange}
                  className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Number of Guests</label>
              <input
                type="number"
                name="guests"
                value={bookingData.guests}
                onChange={handleInputChange}
                min="1"
                max={room?.capacity || 10}
                className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                required
              />
            </div>

            {bookingData.totalPrice > 0 && (
              <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="font-bold">Total Price: ${bookingData.totalPrice}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-navy-700 text-white px-6 py-2 rounded"
                disabled={loading}
              >
                Continue to Guest Information
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Guest Information */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Guest Information</h2>

          <form onSubmit={handleGuestInfo}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="contactName"
                value={bookingData.contactName}
                onChange={handleInputChange}
                className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="contactEmail"
                value={bookingData.contactEmail}
                onChange={handleInputChange}
                className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="contactPhone"
                value={bookingData.contactPhone}
                onChange={handleInputChange}
                className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Special Requests</label>
              <textarea
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleInputChange}
                className="w-full bg-gray-200 border border-gray-300 rounded p-2 h-32"
              ></textarea>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded"
                disabled={loading}
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-navy-700 text-white px-6 py-2 rounded"
                disabled={loading}
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Payment</h2>

          <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Booking Summary</h3>
            <p><span className="font-semibold">Room:</span> {room?.name}</p>
            <p><span className="font-semibold">Check-in:</span> {new Date(bookingData.checkIn).toLocaleDateString()}</p>
            <p><span className="font-semibold">Check-out:</span> {new Date(bookingData.checkOut).toLocaleDateString()}</p>
            <p><span className="font-semibold">Guests:</span> {bookingData.guests}</p>
            <p className="text-lg font-bold mt-2">Total: ${bookingData.totalPrice}</p>
          </div>

          <form onSubmit={handlePayment}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={bookingData.paymentMethod}
                onChange={handleInputChange}
                className="w-full bg-gray-200 border border-gray-300 rounded p-2"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            {bookingData.paymentMethod === 'credit_card' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={bookingData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={bookingData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">CVC</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={bookingData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name on Card</label>
                  <input
                    type="text"
                    name="nameOnCard"
                    value={bookingData.nameOnCard}
                    onChange={handleInputChange}
                    className="w-full bg-gray-200 border border-gray-300 rounded p-2"
                  />
                </div>
              </>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded"
                disabled={loading}
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-navy-700 text-white px-6 py-2 rounded"
                disabled={loading}
              >
                Confirm and Pay
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
