'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocalization } from '../../../../src/contexts/LocalizationContext';
import ErrorHandler from '../../../../src/components/ErrorHandler';

export default function BookingConfirmation() {
    const { id } = useParams();
    const { translate, formatCurrency, formatDate } = useLocalization();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await fetch(`/api/bookings/${id}`);
                if (!response.ok) throw new Error('Failed to fetch booking details');
                const data = await response.json();
                setBooking(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [id]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <ErrorHandler message={error} />;
    if (!booking) return <div className="text-center py-8">Booking not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600 mb-2">
                        {translate('bookingConfirmed')}
                    </h1>
                    <p className="text-gray-600">
                        {translate('bookingConfirmationMessage')}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Booking Details */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {translate('bookingDetails')}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">{translate('bookingNumber')}</p>
                                <p className="font-semibold">{booking.bookingNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">{translate('status')}</p>
                                <p className="font-semibold text-green-600">
                                    {translate(booking.status)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">{translate('checkIn')}</p>
                                <p className="font-semibold">
                                    {formatDate(booking.checkIn, 'PPP')}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">{translate('checkOut')}</p>
                                <p className="font-semibold">
                                    {formatDate(booking.checkOut, 'PPP')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Room Details */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {translate('roomDetails')}
                        </h2>
                        <div className="space-y-2">
                            <p className="font-semibold">{booking.room.name}</p>
                            <p className="text-gray-600">{booking.room.description}</p>
                            <p className="text-gray-600">
                                {translate('guests')}: {booking.guests}
                            </p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {translate('paymentDetails')}
                        </h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">{translate('roomRate')}</span>
                                <span>{formatCurrency(booking.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">{translate('taxes')}</span>
                                <span>{formatCurrency(booking.taxes)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg">
                                <span>{translate('total')}</span>
                                <span>{formatCurrency(booking.totalAmount + booking.taxes)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Guest Information */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            {translate('guestInformation')}
                        </h2>
                        <div className="space-y-2">
                            <p>
                                <span className="text-gray-600">{translate('name')}:</span>{' '}
                                {booking.guestName}
                            </p>
                            <p>
                                <span className="text-gray-600">{translate('email')}:</span>{' '}
                                {booking.guestEmail}
                            </p>
                            <p>
                                <span className="text-gray-600">{translate('phone')}:</span>{' '}
                                {booking.guestPhone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                        {translate('bookingConfirmationFooter')}
                    </p>
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {translate('printConfirmation')}
                    </button>
                </div>
            </div>
        </div>
    );
} 