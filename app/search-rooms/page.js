'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  Wifi,
  Coffee,
  Tv,
  Bath,
  Users,
  Calendar,
  BedDouble,
  ArrowRight,
  Filter,
  ChevronDown
} from 'lucide-react';

export default function SearchRoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    roomType: 'all',
    amenities: []
  });

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const roomCount = searchParams.get('rooms');

  useEffect(() => {
    fetchAvailableRooms();
  }, [checkIn, checkOut, guests, roomCount]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(`/api/rooms/available?${searchParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch rooms');
      }

      setRooms(data.rooms);
    } catch (error) {
      setError('Failed to load available rooms. Please try again later.');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (roomId) => {
    if (!user) {
      router.push(`/login?redirect=/booking/${roomId}?${searchParams.toString()}`);
      return;
    }
    router.push(`/booking/${roomId}?${searchParams.toString()}`);
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (room.price < min || room.price > max) return false;
    }
    if (filters.roomType !== 'all' && room.type !== filters.roomType) return false;
    if (filters.amenities.length > 0) {
      return filters.amenities.every(amenity => room.amenities.includes(amenity));
    }
    return true;
  });

  const RoomCard = ({ room }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
            <p className="text-gray-600">{room.type}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${room.price}</p>
            <p className="text-sm text-gray-600">per night</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {room.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
              >
                {amenity === 'wifi' && <Wifi className="h-4 w-4 mr-1" />}
                {amenity === 'coffee' && <Coffee className="h-4 w-4 mr-1" />}
                {amenity === 'tv' && <Tv className="h-4 w-4 mr-1" />}
                {amenity === 'bath' && <Bath className="h-4 w-4 mr-1" />}
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>Up to {room.maxGuests} guests</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BedDouble className="h-5 w-5 mr-2" />
            <span>{room.bedType}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>
              {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => handleBookNow(room.id)}
          className="w-full bg-mrs-blue text-white px-6 py-3 rounded-md hover:bg-navy-800 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Book Now</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Available Rooms</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>{guests} Guest(s), {roomCount} Room(s)</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <select
                        value={filters.priceRange}
                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="all">All Prices</option>
                        <option value="0-100">$0 - $100</option>
                        <option value="100-200">$100 - $200</option>
                        <option value="200-300">$200 - $300</option>
                        <option value="300-500">$300 - $500</option>
                        <option value="500-99999">$500+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Type
                      </label>
                      <select
                        value={filters.roomType}
                        onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="all">All Types</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="suite">Suite</option>
                        <option value="deluxe">Deluxe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amenities
                      </label>
                      <div className="space-y-2">
                        {['wifi', 'tv', 'bath', 'coffee'].map(amenity => (
                          <label key={amenity} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.amenities.includes(amenity)}
                              onChange={(e) => {
                                const newAmenities = e.target.checked
                                  ? [...filters.amenities, amenity]
                                  : filters.amenities.filter(a => a !== amenity);
                                setFilters({ ...filters, amenities: newAmenities });
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700 capitalize">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room List */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRooms.map(room => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Image
                      src="/assets/images/no-rooms.svg"
                      alt="No rooms available"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No rooms available
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or dates
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 