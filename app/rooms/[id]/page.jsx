'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocalization } from '../../../src/contexts/LocalizationContext';
import Image from 'next/image';
import BookingForm from '../../../src/components/BookingForm';
import ErrorHandler from '../../../src/components/ErrorHandler';

export default function RoomDetails() {
    const { id } = useParams();
    const { translate, formatCurrency } = useLocalization();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await fetch(`/api/rooms/${id}`);
                if (!response.ok) throw new Error('Failed to fetch room details');
                const data = await response.json();
                setRoom(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [id]);

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <ErrorHandler message={error} />;
    if (!room) return <div className="text-center py-8">Room not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Room Images */}
                <div className="space-y-4">
                    <div className="relative h-96 w-full">
                        <Image
                            src={room.images[0]}
                            alt={room.name}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {room.images.slice(1).map((image, index) => (
                            <div key={index} className="relative h-32">
                                <Image
                                    src={image}
                                    alt={`${room.name} - ${index + 2}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Details */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{room.name}</h1>
                    <p className="text-gray-600">{room.description}</p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold">{translate('price')}:</span>
                            <span className="text-xl">{formatCurrency(room.price)}</span>
                            <span className="text-gray-500">/ {translate('night')}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="font-semibold">{translate('capacity')}:</span>
                            <span>{room.capacity} {translate('guests')}</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="font-semibold">{translate('size')}:</span>
                            <span>{room.size} m²</span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">{translate('amenities')}:</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {room.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-green-500">✓</span>
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="mt-8">
                        <BookingForm roomId={id} roomPrice={room.price} />
                    </div>
                </div>
            </div>
        </div>
    );
} 