'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  BedDouble,
  Users,
  Star,
  Tag,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
  totalBookings: number;
  averageRating: number | null;
  currentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoomsManagement() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/rooms');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch rooms');
      }

      setRooms(data);
    } catch (error) {
      setError('Failed to load rooms');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      fetchRooms();
    } catch (error) {
      setError('Failed to delete room');
      console.error('Error deleting room:', error);
    }
  };

  const toggleRoomStatus = async (roomId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update room status');
      }

      fetchRooms();
    } catch (error) {
      setError('Failed to update room status');
      console.error('Error updating room status:', error);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const searchString = `${room.name} ${room.description} ${room.currentStatus}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-mrs-blue" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms Management</h1>
          <p className="text-gray-600">Manage hotel rooms, pricing, and availability</p>
        </div>
        <button
          onClick={() => router.push('/admin/rooms/add')}
          className="bg-mrs-blue text-white px-4 py-2 rounded-md hover:bg-navy-800 flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Room
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-mrs-blue"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              {room.images && room.images.length > 0 ? (
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <BedDouble className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {room.currentStatus}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="flex items-center text-sm text-gray-700">
                  <Tag className="h-4 w-4 mr-1 text-mrs-blue" />
                  ${room.price}/night
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Users className="h-4 w-4 mr-1 text-mrs-blue" />
                  {room.capacity} guests
                </div>
                {room.averageRating !== null && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    {room.averageRating.toFixed(1)}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {room.totalBookings} bookings
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleRoomStatus(room.id, room.available)}
                    className={`p-1.5 rounded-md ${
                      room.available ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}
                    title={room.available ? 'Mark as unavailable' : 'Mark as available'}
                  >
                    {room.available ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => router.push(`/admin/rooms/${room.id}/edit`)}
                    className="p-1.5 bg-blue-50 text-blue-600 rounded-md"
                    title="Edit room"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="p-1.5 bg-red-50 text-red-600 rounded-md"
                    title="Delete room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredRooms.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BedDouble className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No rooms found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Add your first room to get started'}
          </p>
        </div>
      )}
    </div>
  );
}
