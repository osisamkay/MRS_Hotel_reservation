'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNotification } from '@/src/contexts/NotificationContext';
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
  ChevronDown,
  Minus,
  Plus
} from 'lucide-react';
import CustomDatePicker from '@/src/components/CustomDatePicker';

export default function SearchRoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  // Parse URL parameters with proper defaults
  const initialCheckIn = searchParams.get('checkIn') || new Date().toISOString();
  const initialCheckOut = searchParams.get('checkOut') || new Date(Date.now() + 86400000).toISOString();
  const initialAdults = parseInt(searchParams.get('adults') || '1', 10);
  const initialSeniors = parseInt(searchParams.get('seniors') || '0', 10);
  const initialRooms = parseInt(searchParams.get('rooms') || '1', 10);

  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialAdults + initialSeniors);
  const [roomCount, setRoomCount] = useState(initialRooms);
  const [filters, setFilters] = useState({
    priceRange: 'all',
    roomType: 'all',
    amenities: []
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update state when URL parameters change
  useEffect(() => {
    const newCheckIn = searchParams.get('checkIn');
    const newCheckOut = searchParams.get('checkOut');
    const newAdults = parseInt(searchParams.get('adults') || '1', 10);
    const newSeniors = parseInt(searchParams.get('seniors') || '0', 10);
    const newRooms = parseInt(searchParams.get('rooms') || '1', 10);

    if (newCheckIn) setCheckIn(newCheckIn);
    if (newCheckOut) setCheckOut(newCheckOut);
    if (newAdults || newSeniors) setGuests(newAdults + newSeniors);
    if (newRooms) setRoomCount(newRooms);
  }, [searchParams]);

  useEffect(() => {
    fetchAvailableRooms();
  }, [checkIn, checkOut, guests, roomCount]);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      setError('');

      // Ensure dates are in ISO format
      const formattedCheckIn = new Date(checkIn).toISOString();
      const formattedCheckOut = new Date(checkOut).toISOString();

      const params = {
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests: guests.toString(),
        rooms: roomCount.toString()
      };

      console.log('Fetching rooms with params:', params);

      const apiUrl = `/api/rooms/available?` + new URLSearchParams(params);

      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(e => ({ message: 'Failed to parse error response' }));
        console.error('API error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch rooms');
      }

      let data;
      try {
        data = await response.json();
        console.log('API response data:', data);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Failed to parse server response');
      }

      // Handle both array and object response formats
      const roomsData = Array.isArray(data) ? data : data.rooms;

      if (!Array.isArray(roomsData)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      // Add placeholder data for testing
      const roomsWithPlaceholders = roomsData.map(room => {
        if (!room || typeof room !== 'object') {
          console.error('Invalid room data:', room);
          return null;
        }

        const processedRoom = {
          id: room.id || 'unknown',
          name: room.name || 'Standard Room',
          price: typeof room.price === 'number' ? room.price : 100,
          images: Array.isArray(room.images) ? room.images : ['/assets/images/room1.jpg'],
          amenities: Array.isArray(room.amenities) ? room.amenities : ['Wifi', 'TV', 'Air Conditioning'],
          maxGuests: room.capacity || 2,
          bedType: room.bedType || 'King Size Bed',
          type: room.type || 'Standard',
          capacity: room.capacity || 2,
          description: room.description || 'A comfortable room for your stay.'
        };
        console.log('Processed room:', processedRoom);
        return processedRoom;
      }).filter(Boolean); // Remove any null values

      console.log('Final rooms data:', roomsWithPlaceholders);

      setRooms(roomsWithPlaceholders);

      // Show notification based on results
      if (roomsWithPlaceholders.length === 0) {
        showNotification('info', 'No rooms available for your selected dates.');
      } else {
        showNotification('success', `Found ${roomsWithPlaceholders.length} available rooms`);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError(error.message || 'Failed to load available rooms. Please try again later.');
      showNotification('error', error.message || 'Failed to load available rooms. Please try again later.');
      // Set empty rooms array on error
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (roomId) => {
    router.push(`/booking/${roomId}?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`);
  };

  const applyPriceFilter = (room, priceRange) => {
    if (priceRange === 'all') return true;

    const [min, max] = priceRange.split('-').map(Number);
    return room.price >= min && room.price <= max;
  };

  const applyRoomTypeFilter = (room, roomType) => {
    if (roomType === 'all') return true;

    // Make case-insensitive comparison
    return room.type?.toLowerCase() === roomType.toLowerCase();
  };

  const applyAmenitiesFilter = (room, selectedAmenities) => {
    if (!selectedAmenities.length) return true;

    // Convert all strings to lowercase for case-insensitive comparison
    const roomAmenities = room.amenities.map(a => a.toLowerCase());
    return selectedAmenities.every(amenity =>
      roomAmenities.some(a => a.includes(amenity.toLowerCase()))
    );
  };

  const filteredRooms = rooms.filter(room =>
    applyPriceFilter(room, filters.priceRange) &&
    applyRoomTypeFilter(room, filters.roomType) &&
    applyAmenitiesFilter(room, filters.amenities)
  );

  // Show notification when filters result in no rooms
  useEffect(() => {
    if (!loading && rooms.length > 0 && filteredRooms.length === 0) {
      showNotification('warning', 'No rooms match your current filters');
    }
  }, [filteredRooms.length, rooms.length, loading, showNotification]);

  const RoomCard = ({ room }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64">
        <Image
          src={`${room.images[0]}`}
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
            <p className="text-2xl font-bold text-gray-900">${room.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">per night</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center"
              >
                {amenity.toLowerCase().includes('wifi') && <Wifi className="h-4 w-4 mr-1" />}
                {amenity.toLowerCase().includes('coffee') && <Coffee className="h-4 w-4 mr-1" />}
                {amenity.toLowerCase().includes('tv') && <Tv className="h-4 w-4 mr-1" />}
                {amenity.toLowerCase().includes('bath') && <Bath className="h-4 w-4 mr-1" />}
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>Up to {room.maxGuests || room.capacity} guests</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BedDouble className="h-5 w-5 mr-2" />
            <span>{room.bedType || 'Standard Bed'}</span>
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
          className="w-full bg-navy-700 text-white px-6 py-3 rounded-md hover:bg-navy-800 transition-colors flex items-center justify-center space-x-2"
        >
          <span>Book Now</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  // Calculate date range for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Mobile filter toggle
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      priceRange: 'all',
      roomType: 'all',
      amenities: []
    });
    showNotification('info', 'Filters have been reset');
  };

  const handleDateChange = (date, type) => {
    if (type === 'checkIn') {
      setCheckIn(date);
      // If check-out date is before new check-in date, adjust it
      if (new Date(checkOut) <= date) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setCheckOut(nextDay);
      }
    } else {
      setCheckOut(date);
    }
  };

  const handleGuestChange = (action) => {
    if (action === 'increase') {
      setGuests(prev => prev + 1);
    } else if (action === 'decrease' && guests > 1) {
      setGuests(prev => prev - 1);
    }
  };

  const handleRoomChange = (action) => {
    if (action === 'increase') {
      setRoomCount(prev => prev + 1);
    } else if (action === 'decrease' && roomCount > 1) {
      setRoomCount(prev => prev - 1);
    }
  };

  const handleSearch = () => {
    // Update URL with new search parameters
    const searchParams = new URLSearchParams();
    searchParams.set('checkIn', checkIn);
    searchParams.set('checkOut', checkOut);
    searchParams.set('adults', Math.ceil(guests * 0.8).toString()); // Approximate split between adults and seniors
    searchParams.set('seniors', Math.floor(guests * 0.2).toString());
    searchParams.set('rooms', roomCount.toString());

    // Apply any active filters
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      searchParams.set('minPrice', min.toString());
      searchParams.set('maxPrice', max.toString());
    }
    if (filters.roomType !== 'all') {
      searchParams.set('roomType', filters.roomType);
    }
    if (filters.amenities.length > 0) {
      searchParams.set('amenities', filters.amenities.join(','));
    }

    // Update the URL and trigger a new search
    router.push(`/search-rooms?${searchParams.toString()}`);
    fetchAvailableRooms();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Available Rooms</h1>
            <div className="flex flex-col md:flex-row gap-6 text-gray-600">
              <div className="flex flex-col gap-2">
                <label className="font-medium">Dates</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-36">
                    <CustomDatePicker
                      selected={new Date(checkIn)}
                      onChange={(date) => handleDateChange(date, 'checkIn')}
                      minDate={new Date()}
                      className="w-full"
                    />
                  </div>
                  <span>-</span>
                  <div className="relative w-36">
                    <CustomDatePicker
                      selected={new Date(checkOut)}
                      onChange={(date) => handleDateChange(date, 'checkOut')}
                      minDate={new Date(checkIn)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">Guests & Rooms</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleGuestChange('decrease')}
                      className="p-2 border rounded-l hover:bg-gray-100"
                      disabled={guests <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border-t border-b min-w-[3rem] text-center">
                      {guests}
                    </span>
                    <button
                      onClick={() => handleGuestChange('increase')}
                      className="p-2 border rounded-r hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="ml-2">Guest(s)</span>
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => handleRoomChange('decrease')}
                      className="p-2 border rounded-l hover:bg-gray-100"
                      disabled={roomCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border-t border-b min-w-[3rem] text-center">
                      {roomCount}
                    </span>
                    <button
                      onClick={() => handleRoomChange('increase')}
                      className="p-2 border rounded-r hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="ml-2">Room(s)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="bg-navy-600 text-white px-6 py-2 rounded-md hover:bg-navy-700 transition-colors"
                >
                  Update Search
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {/* Mobile filter button */}
          <div className="lg:hidden mb-4">
            <button
              className="flex items-center justify-center w-full bg-white p-4 rounded-md shadow"
              onClick={toggleMobileFilters}
            >
              <Filter className="h-5 w-5 mr-2" />
              <span>Filters</span>
              <ChevronDown className={`h-5 w-5 ml-2 transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
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
                        <option value="standard">Standard</option>
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

                    {/* Reset Filters button */}
                    <div className="pt-2">
                      <button
                        onClick={handleFilterReset}
                        className="text-navy-700 hover:text-navy-800 text-sm font-medium"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room List */}
            <div className="lg:col-span-3">
              {/* Results summary */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                  {loading ? 'Loading rooms...' : `${filteredRooms.length} ${filteredRooms.length === 1 ? 'room' : 'rooms'} available`}
                </p>
                <div className="hidden md:block">
                  <select
                    className="border rounded-md p-2"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;

                      showNotification('info', `Sorting by price: ${val === 'price-asc' ? 'low to high' : 'high to low'}`);

                      const sorted = [...rooms].sort((a, b) => {
                        if (val === 'price-asc') return a.price - b.price;
                        if (val === 'price-desc') return b.price - a.price;
                        return 0;
                      });
                      setRooms(sorted);
                    }}
                  >
                    <option value="">Sort by</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

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
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <div className="mb-4">
                    <Filter className="h-20 w-20 mx-auto text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No rooms match your filters
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filter criteria or dates
                  </p>
                  <button
                    onClick={handleFilterReset}
                    className="text-navy-700 hover:text-navy-800 font-medium"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
