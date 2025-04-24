// src/components/rooms/RoomDetails.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Room } from '@/src/types/booking';
import { useLocalization } from '@/src/contexts/LocalizationContext';
import { Wifi, Tv, Bath, Coffee, User, BedDouble, SatelliteDish, UtensilsCrossed } from 'lucide-react';

interface RoomDetailsProps {
  room: Room;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room }) => {
  const { formatCurrency } = useLocalization();
  const [selectedImage, setSelectedImage] = useState<string>(room.images[0] || '/assets/images/room1.jpg');

  // Map amenity names to their corresponding icons
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="h-5 w-5 mr-2" />;
    if (amenityLower.includes('tv')) return <Tv className="h-5 w-5 mr-2" />;
    if (amenityLower.includes('bath')) return <Bath className="h-5 w-5 mr-2" />;
    if (amenityLower.includes('coffee')) return <Coffee className="h-5 w-5 mr-2" />;
    if (amenityLower.includes('satellite')) return <SatelliteDish className="h-5 w-5 mr-2" />;
    if (amenityLower.includes('breakfast') || amenityLower.includes('meal')) return <UtensilsCrossed className="h-5 w-5 mr-2" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Room Images */}
      <div className="space-y-4">
        <div className="relative h-96 w-full">
          <Image
            src={selectedImage}
            alt={room.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {room.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative h-24 rounded-lg overflow-hidden border-2 ${
                selectedImage === image ? 'border-navy-700' : 'border-transparent'
              }`}
            >
              <Image
                src={image}
                alt={`${room.name} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{room.name}</h1>
          <p className="text-sm text-gray-500">{room.type || 'Standard Room'}</p>
        </div>
        
        <p className="text-gray-700">{room.description}</p>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-700">Price:</span>
            <span className="text-2xl font-bold text-navy-700">{formatCurrency(room.price)}</span>
            <span className="text-gray-500">/ night</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-700">
            <User className="h-5 w-5" />
            <span>Up to {room.capacity} guests</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-700">
            <BedDouble className="h-5 w-5" />
            <span>{room.bedType || 'Standard Bed'}</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-lg mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-y-3">
            {room.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center text-gray-700">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-lg mb-3">Room Policy</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Check-in: After 2:00 PM</li>
            <li>Check-out: Before 11:00 AM</li>
            <li>No smoking</li>
            <li>No pets allowed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;