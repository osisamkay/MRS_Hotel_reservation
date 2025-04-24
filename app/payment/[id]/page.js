'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/src/contexts/NotificationContext';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import PaymentLoading from '@/src/components/payment/PaymentLoading';
import PaymentError from '@/src/components/payment/PaymentError';
import { Phone } from 'lucide-react';

export default function PaymentPage({ params }) {
    const router = useRouter();
    const { showNotification } = useNotification();

    // State
    const [booking, setBooking] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        emailAddress: '',
        streetName: '',
        city: '',
        provinceState: '',
        postalCode: '',
        country: '',
    });
    const [cardDetails, setCardDetails] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        cvv: '',
        postalCode: '',
        provinceState: '',
        country: '',
    });

    // Fetch booking details
    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setLoading(true);
                const bookingId = params.id;

                // Get guest email from localStorage if available
                let guestEmail = '';
                if (typeof window !== 'undefined') {
                    // First try to get the email from the direct key-value pair
                    guestEmail = localStorage.getItem('guestEmail');
                    console.log('Retrieved guestEmail directly from localStorage:', guestEmail);

                    // If not found, try to get it from bookingState
                    if (!guestEmail) {
                        const bookingState = localStorage.getItem('bookingState');
                        console.log('Retrieved bookingState from localStorage:', bookingState);

                        if (bookingState) {
                            try {
                                const parsedState = JSON.parse(bookingState);
                                console.log('Parsed bookingState:', parsedState);

                                if (parsedState && parsedState.email) {
                                    guestEmail = parsedState.email;
                                    console.log('Using guest email from bookingState:', guestEmail);
                                }
                            } catch (e) {
                                console.error('Error parsing booking state:', e);
                            }
                        }
                    }
                }

                // Fetch booking details with guest email header
                console.log(`Fetching booking ${bookingId} with guest email header:`, guestEmail);

                const bookingResponse = await fetch(`/api/bookings/${bookingId}`, {
                    headers: {
                        'x-guest-email': guestEmail || ''
                    }
                });

                if (!bookingResponse.ok) {
                    const errorText = await bookingResponse.text();
                    console.error('Booking fetch failed:', bookingResponse.status, errorText);
                    try {
                        const errorJson = JSON.parse(errorText);
                        throw new Error(errorJson.error || 'Failed to fetch booking details');
                    } catch (e) {
                        throw new Error('Failed to fetch booking details');
                    }
                }

                const bookingData = await bookingResponse.json();
                setBooking(bookingData);

                // Pre-fill billing info if available
                if (bookingData.guestName) {
                    const nameParts = bookingData.guestName.split(' ');
                    setBillingInfo(prev => ({
                        ...prev,
                        firstName: nameParts[0] || '',
                        lastName: nameParts.slice(1).join(' ') || '',
                        emailAddress: bookingData.guestEmail || guestEmail || '',
                        phoneNumber: bookingData.guestPhone || '',
                    }));

                    // Also pre-fill cardholder name
                    setCardDetails(prev => ({
                        ...prev,
                        cardholderName: bookingData.guestName || '',
                    }));
                }

                // Fetch room details
                const roomResponse = await fetch(`/api/rooms/${bookingData.roomId}`);
                if (!roomResponse.ok) {
                    throw new Error('Failed to fetch room details');
                }

                const roomData = await roomResponse.json();
                setRoom(roomData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking details:', error);
                setError('Failed to load booking details. Please try again.');
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [params.id]);

    // Handle billing info change
    const handleBillingInfoChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle card details change
    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle payment method selection
    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            setError('Please select a payment method');
            return;
        }

        try {
            setLoading(true);

            // Process payment
            const paymentResponse = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: booking.id,
                    amount: booking.totalPrice,
                    method: paymentMethod,
                    // For credit/debit card payments, include card details
                    ...(paymentMethod === 'creditCard' || paymentMethod === 'debitCard' ? {
                        cardDetails: {
                            last4: cardDetails.cardNumber.slice(-4),
                            expiryDate: cardDetails.expiryMonth,
                        }
                    } : {})
                }),
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();
                throw new Error(errorData.error || 'Failed to process payment');
            }

            // Payment successful
            showNotification('success', 'Payment processed successfully! A confirmation email has been sent.');

            // Redirect to confirmation page
            setTimeout(() => {
                router.push(`/booking/confirmation/${booking.id}`);
            }, 2000);
        } catch (error) {
            console.error('Payment error:', error);
            setError(error.message || 'Failed to process payment');
            showNotification('error', error.message || 'Failed to process payment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <PaymentLoading />;
    }

    if (error && !booking) {
        return <PaymentError error={error} onBack={() => router.back()} />;
    }

    return (
        <div className="bg-white min-h-screen">
            <PageHeader />

            {/* Hotel Header */}
            <div className="bg-navy-800 text-white py-4 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-3xl font-bold text-center mb-1">MOOSE ROCK AND SUITES</h1>
                    <p className="text-center mb-2">117 Carrington Avenue BC</p>
                    <div className="flex justify-center items-center">
                        <Phone className="h-5 w-5 mr-2" />
                        <span>342 709 4565</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Booking Summary */}
                {booking && room && (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-2">Booking Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p><span className="font-semibold">Room:</span> {room.name}</p>
                                <p><span className="font-semibold">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
                                <p><span className="font-semibold">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Guests:</span> {booking.guests}</p>
                                <p><span className="font-semibold">Booking ID:</span> {booking.id}</p>
                                <p className="text-lg font-bold mt-2">Total: ${booking.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Billing Address */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Billing Address:</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={billingInfo.firstName}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={billingInfo.lastName}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Phone Number:</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={billingInfo.phoneNumber}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Email Address:</label>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    value={billingInfo.emailAddress}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Street Name:</label>
                                <input
                                    type="text"
                                    name="streetName"
                                    value={billingInfo.streetName}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">City:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={billingInfo.city}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Province/State:</label>
                                <input
                                    type="text"
                                    name="provinceState"
                                    value={billingInfo.provinceState}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Country:</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={billingInfo.country}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Postal Code/Zip Code:</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={billingInfo.postalCode}
                                    onChange={handleBillingInfoChange}
                                    className="w-full p-2 bg-gray-200 rounded"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Pay With:</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => handlePaymentMethodChange('cash')}
                                    className="mr-2"
                                />
                                <span>Cash</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="debitCard"
                                    checked={paymentMethod === 'debitCard'}
                                    onChange={() => handlePaymentMethodChange('debitCard')}
                                    className="mr-2"
                                />
                                <span>Debit Card</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="creditCard"
                                    checked={paymentMethod === 'creditCard'}
                                    onChange={() => handlePaymentMethodChange('creditCard')}
                                    className="mr-2"
                                />
                                <span>Credit Card</span>
                            </label>

                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="digitalWallet"
                                    checked={paymentMethod === 'digitalWallet'}
                                    onChange={() => handlePaymentMethodChange('digitalWallet')}
                                    className="mr-2"
                                />
                                <span>Digital Wallet</span>
                            </label>
                        </div>

                        {/* Payment Icons */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                            <div className="flex justify-center">
                                <Image src="/assets/images/mastercard.svg" alt="Mastercard" width={80} height={50} className="h-10 object-contain" />
                            </div>
                            <div className="flex justify-center">
                                <Image src="/assets/images/visa.svg" alt="Visa" width={80} height={50} className="h-10 object-contain" />
                            </div>
                            <div className="flex justify-center">
                                <Image src="/assets/images/amex.svg" alt="American Express" width={80} height={50} className="h-10 object-contain" />
                            </div>
                            <div className="flex justify-center">
                                <Image src="/assets/images/interac.svg" alt="Interac" width={80} height={50} className="h-10 object-contain" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex justify-center">
                                <Image src="/assets/images/paypal.svg" alt="PayPal" width={80} height={50} className="h-10 object-contain" />
                            </div>
                            <div className="flex justify-center">
                                <Image src="/assets/images/applepay.svg" alt="Apple Pay" width={80} height={50} className="h-10 object-contain" />
                            </div>
                            <div className="flex justify-center">
                                <Image src="/assets/images/googlepay.svg" alt="Google Pay" width={80} height={50} className="h-10 object-contain" />
                            </div>
                            <div className="flex justify-center">
                                <Image src="/assets/images/samsungpay.svg" alt="Samsung Pay" width={80} height={50} className="h-10 object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* Credit Card Details */}
                    {(paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4">Payment Details:</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Cardholder Name:</label>
                                    <input
                                        type="text"
                                        name="cardholderName"
                                        value={cardDetails.cardholderName}
                                        onChange={handleCardDetailsChange}
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Card Number:</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={handleCardDetailsChange}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1">Expiry Month:</label>
                                    <input
                                        type="text"
                                        name="expiryMonth"
                                        value={cardDetails.expiryMonth}
                                        onChange={handleCardDetailsChange}
                                        placeholder="MM/YY"
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1">CVV:</label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={cardDetails.cvv}
                                        onChange={handleCardDetailsChange}
                                        placeholder="123"
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1">Postal Code/Zip Code:</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={cardDetails.postalCode}
                                        onChange={handleCardDetailsChange}
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1">Province/State:</label>
                                    <input
                                        type="text"
                                        name="provinceState"
                                        value={cardDetails.provinceState}
                                        onChange={handleCardDetailsChange}
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium mb-1">Country:</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={cardDetails.country}
                                        onChange={handleCardDetailsChange}
                                        className="w-full p-2 bg-gray-200 rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-navy-800 text-white py-4 px-4 rounded-md hover:bg-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 disabled:opacity-50 text-lg font-bold"
                    >
                        {loading ? 'Processing...' : 'Proceed To Checkout'}
                    </button>
                </form>
            </div>
        </div>
    );
}
