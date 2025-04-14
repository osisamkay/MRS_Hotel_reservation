'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/src/components/PageHeader';
import { useAuth } from '@/src/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const ProfileField = ({ icon: Icon, label, value, name, type = 'text' }) => (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Icon className="h-5 w-5 text-gray-500 mr-2" />
        <label className="text-sm font-medium text-gray-600">{label}</label>
      </div>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      ) : (
        <p className="text-gray-900">{value || 'Not provided'}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-navy-700 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-navy-700 text-3xl font-bold">
                {user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-navy-200">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <ProfileField
                  icon={User}
                  label="First Name"
                  value={user.firstName}
                  name="firstName"
                />
                <ProfileField
                  icon={User}
                  label="Last Name"
                  value={user.lastName}
                  name="lastName"
                />
                <ProfileField
                  icon={Mail}
                  label="Email"
                  value={user.email}
                  name="email"
                  type="email"
                />
                <ProfileField
                  icon={Phone}
                  label="Phone"
                  value={user.phone}
                  name="phone"
                  type="tel"
                />
                <ProfileField
                  icon={MapPin}
                  label="Address"
                  value={user.address}
                  name="address"
                />
                <ProfileField
                  icon={Calendar}
                  label="Date of Birth"
                  value={user.dateOfBirth}
                  name="dateOfBirth"
                  type="date"
                />
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-mrs-blue text-white rounded-md hover:bg-navy-800 disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-mrs-blue text-white rounded-md hover:bg-navy-800"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>

            {/* Account Security Section */}
            <div className="mt-12 border-t pt-6">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold">Account Security</h2>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/change-password')}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 flex justify-between items-center"
                >
                  <span>Change Password</span>
                  <span className="text-gray-400">→</span>
                </button>
                <button
                  onClick={() => router.push('/security-settings')}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-100 flex justify-between items-center"
                >
                  <span>Security Settings</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 