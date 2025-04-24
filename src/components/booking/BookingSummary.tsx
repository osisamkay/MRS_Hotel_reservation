// src/components/booking/BookingSummary.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Users, Clock } from 'lucide-react';
import { Room } from '@/src/types/booking';
import { validateBookingDates, calculateTotalPrice } from '@/src/utils/bookingUtils';

interface BookingSummaryProps {
  room: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  dateValidation: { 
    isValid: boolean; 
    error?: string;
    nights?: number;
  };
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  room,
  checkIn,
  checkOut,
  guests,
  dateValidation,
}) => {
  if (!room) return null;
  
  const calculateTotalPriceWithTax = () => {
    if (!room || !dateValidation.isValid || !dateValidation.nights) return 0;
    return calculateTotalPrice(room.price, dateValidation.nights);
  };

  return (
    <div className="space-y-4">
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
            <p className="text-gray-600">{room.type || 'Standard Room'}</p>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Check-in</p>
                <p>{new Date(checkIn).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Check-out</p>
                <p>{new Date(checkOut).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Guests</p>
                <p>{guests} {guests === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Duration</p>
                <p>{dateValidation.nights} {dateValidation.nights === 1 ? 'night' : 'nights'}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Price per night:</span>
              <span>${room.price.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Number of nights:</span>
              <span>{dateValidation.nights}</span>
            </div>
            
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Taxes and fees:</span>
              <span>${(calculateTotalPriceWithTax() - (room.price * (dateValidation.nights || 0))).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
              <span>Total:</span>
              <span>${calculateTotalPriceWithTax().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg border border-navy-200">
        <h3 className="font-medium mb-2">Important Information</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Check-in time starts at 3:00 PM</li>
          <li>• Check-out time is 11:00 AM</li>
          <li>• Photo ID required at check-in</li>
          <li>• No pets allowed</li>
          <li>• No smoking</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingSummary;