'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PageHeader from '@/src/components/PageHeader';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  BedDouble,
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  DollarSign,
  Loader2
} from 'lucide-react';

export default function ManageRoomsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard',
    price: '',
    capacity: '',
    bedType: '',
    description: '',
    amenities: [],
    images: []
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRooms();
  }, [user]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rooms');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms';
      const method = editingRoom ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save room');
      }

      fetchRooms();
      setShowAddModal(false);
      setEditingRoom(null);
      setFormData({
        name: '',
        type: 'Standard',
        price: '',
        capacity: '',
        bedType: '',
        description: '',
        amenities: [],
        images: []
      });
    } catch (error) {
      setError('Failed to save room. Please try again.');
      console.error('Error saving room:', error);
    }
  };

  const handleDelete = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      fetchRooms();
    } catch (error) {
      setError('Failed to delete room. Please try again.');
      console.error('Error deleting room:', error);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const searchString = `${room.name} ${room.type} ${room.description}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
            <p className="text-gray-600">Add, edit, or remove rooms</p>
          </div>
          <button
            onClick={() => {
              setEditingRoom(null);
              setShowAddModal(true);
            }}
            className="bg-mrs-blue text-white px-4 py-2 rounded-md hover:bg-navy-800 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
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

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingRoom(room);
                      setFormData(room);
                      setShowAddModal(true);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add/Edit Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bed Type
                  </label>
                  <input
                    type="text"
                    value={formData.bedType}
                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-mrs-blue text-white px-4 py-2 rounded-md hover:bg-navy-800"
                  >
                    {editingRoom ? 'Save Changes' : 'Add Room'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRoom(null);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 