"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Phone, Calendar, User, CreditCard, MapPin, Mail, CheckCircle } from 'lucide-react';
import ErrorHandler from '../../../../src/components/ErrorHandler';

export default function BookingConfirmation() {
    const { id } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState(null);
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        // Define the fetch function without async/await
        function fetchBookingDetails() {
            // Set loading state
            if (isMounted) setLoading(true);

            // Use fetch with promise chain
            fetch(`/api/bookings/${id}`)
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Failed to fetch booking details');
                    }
                    return response.json();
                })
                .then(function (data) {
                    if (isMounted) {
                        setBooking(data);

                        // Fetch room details
                        return fetch(`/api/rooms/${data.roomId}`);
                    }
                })
                .then(function (response) {
                    if (!response || !response.ok) {
                        throw new Error('Failed to fetch room details');
                    }
                    return response.json();
                })
                .then(function (roomData) {
                    if (isMounted) {
                        setRoom(roomData);
                        setLoading(false);
                    }
                })
                .catch(function (err) {
                    if (isMounted) {
                        console.error('Error fetching booking:', err);
                        setError(err.message || 'An error occurred');
                        setLoading(false);
                    }
                });
        }

        // Call the fetch function
        fetchBookingDetails();

        // Cleanup function to prevent state updates if component unmounts
        return () => {
            isMounted = false;
        };
    }, [id]);

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format currency function
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Calculate number of nights
    const calculateNights = () => {
        if (!booking) return 0;
        const checkIn = new Date(booking.checkIn);
        const checkOut = new Date(booking.checkOut);
        return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    };

    // Calculate taxes (assuming 15% tax rate)
    const calculateTaxes = () => {
        if (!booking) return 0;
        return booking.totalPrice * 0.15;
    };

    // Calculate total with taxes
    const calculateTotal = () => {
        if (!booking) return 0;
        return booking.totalPrice + calculateTaxes();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-navy-700 rounded-full mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorHandler message={error} />;
    }

    if (!booking || !room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the booking you're looking for.</p>
                    <button
                        onClick={() => router.push('/search-rooms')}
                        className="bg-navy-700 text-white px-6 py-2 rounded-md hover:bg-navy-800"
                    >
                        Browse Rooms
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
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

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Confirmation Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600 text-lg">
                        Your reservation has been successfully confirmed. A confirmation email has been sent to {booking.guestEmail}.
                    </p>
                    <div className="mt-4 inline-block bg-gray-100 px-4 py-2 rounded-full">
                        <span className="font-semibold">Booking ID:</span> {booking.id}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Room Details */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                            <div className="relative h-64">
                                <Image
                                    src={room.images && room.images.length > 0 ? room.images[0] : "/assets/images/room-placeholder.jpg"}
                                    alt={room.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h2>
                                <p className="text-gray-600 mb-4">{room.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-navy-700 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Check-in</p>
                                            <p className="font-medium">{formatDate(booking.checkIn)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-navy-700 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Check-out</p>
                                            <p className="font-medium">{formatDate(booking.checkOut)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 text-navy-700 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Guests</p>
                                            <p className="font-medium">{booking.guests}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 text-navy-700 mr-2" />
                                        <div>
                                            <p className="text-sm text-gray-500">Room Type</p>
                                            <p className="font-medium">{room.type || "Standard"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities */}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {room.amenities.map((amenity, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guest Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <User className="h-5 w-5 text-navy-700 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Guest Name</p>
                                        <p className="font-medium">{booking.guestName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Mail className="h-5 w-5 text-navy-700 mr-2 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{booking.guestEmail}</p>
                                    </div>
                                </div>
                                {booking.guestPhone && (
                                    <div className="flex items-start">
                                        <Phone className="h-5 w-5 text-navy-700 mr-2 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{booking.guestPhone}</p>
                                        </div>
                                    </div>
                                )}
                                {booking.specialRequests && (
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                                        <p className="bg-gray-50 p-3 rounded">{booking.specialRequests}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Room Rate</span>
                                    <span>{formatCurrency(room.price)} / night</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nights</span>
                                    <span>{calculateNights()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>{formatCurrency(booking.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Taxes (15%)</span>
                                    <span>{formatCurrency(calculateTaxes())}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatCurrency(calculateTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                    <CreditCard className="h-5 w-5 text-navy-700 mr-2" />
                                    <span className="font-medium">Payment Method</span>
                                </div>
                                <p className="text-gray-600">
                                    {booking.paymentMethod ? booking.paymentMethod.charAt(0).toUpperCase() + booking.paymentMethod.slice(1) : "Credit Card"}
                                </p>
                                {booking.paymentStatus && (
                                    <div className="mt-2">
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-navy-700 text-white py-2 px-4 rounded-md hover:bg-navy-800 transition-colors"
                                >
                                    Print Confirmation
                                </button>
                                <button
                                    onClick={() => router.push('/search-rooms')}
                                    className="w-full bg-white border border-navy-700 text-navy-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Book Another Room
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
