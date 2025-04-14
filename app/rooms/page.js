'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import {
  Search,
  Users,
  BedDouble,
  Home,
  Filter,
  SortAsc,
  SortDesc,
  Loader2
} from 'lucide-react';

export default function RoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    capacity: searchParams.get('capacity') || '',
    searchTerm: searchParams.get('search') || ''
  });
  
  // Sort state
  const [sortConfig, setSortConfig] = useState({
    field: searchParams.get('sortField') || 'price',
    direction: searchParams.get('sortDir') || 'asc'
  });

  useEffect(() => {
    fetchRooms();
  }, [filters, sortConfig]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        sortField: sortConfig.field,
        sortDir: sortConfig.direction
      });

      const response = await fetch(`/api/rooms?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch rooms');
      }

      setRooms(data.rooms);
      setError('');
    } catch (error) {
      setError('Failed to load rooms. Please try again later.');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL params
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`/rooms?${params.toString()}`);
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-mrs-blue" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-blue"
                />
              </div>
            </div>

            {/* Room Type Filter */}
            <div className="w-full md:w-48">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-blue"
              >
                <option value="">All Types</option>
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filters */}
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-blue"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-blue"
              />
            </div>

            {/* Capacity Filter */}
            <div className="w-full md:w-48">
              <select
                value={filters.capacity}
                onChange={(e) => handleFilterChange('capacity', e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-blue"
              >
                <option value="">Any Capacity</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Guest(s)</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Available Rooms {rooms.length > 0 && `(${rooms.length})`}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => handleSort('price')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                ${sortConfig.field === 'price' ? 'bg-mrs-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Price
              {sortConfig.field === 'price' && (
                sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => handleSort('capacity')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                ${sortConfig.field === 'capacity' ? 'bg-mrs-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Capacity
              {sortConfig.field === 'capacity' && (
                sortConfig.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Rooms Found</h2>
            <p className="text-gray-600">
              Try adjusting your filters to find available rooms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
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
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {room.name}
                      </h2>
                      <p className="text-gray-600">{room.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-mrs-blue">
                        ${room.price}
                      </p>
                      <p className="text-sm text-gray-500">per night</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BedDouble className="h-5 w-5 mr-2" />
                      <span>{room.bedType}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/rooms/${room.id}`)}
                    className="w-full bg-mrs-blue text-white py-2 rounded-md hover:bg-navy-800 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 