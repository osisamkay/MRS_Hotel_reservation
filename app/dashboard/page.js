'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/src/components/PageHeader';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/dashboard/stats');
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Fetch recent bookings
      const bookingsResponse = await fetch('/api/dashboard/recent-bookings');
      if (!bookingsResponse.ok) {
        throw new Error('Failed to fetch recent bookings');
      }
      const bookingsData = await bookingsResponse.json();
      setRecentBookings(bookingsData.bookings || []);
      
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  // If session is loading, show loading state
  if (status === 'loading') {
    return <div className="text-center py-8">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/dashboard');
    return null;
  }
  
  // If user is not an admin or staff, redirect to unauthorized page
  if (session && !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
    router.push('/unauthorized');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Dashboard Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-navy-700 text-navy-700'
                : 'text-gray-500 hover:text-navy-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'bookings'
                ? 'border-b-2 border-navy-700 text-navy-700'
                : 'text-gray-500 hover:text-navy-700'
            }`}
            onClick={() => setActiveTab('bookings')}
          >
            Recent Bookings
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'rooms'
                ? 'border-b-2 border-navy-700 text-navy-700'
                : 'text-gray-500 hover:text-navy-700'
            }`}
            onClick={() => {
              router.push('/manage/rooms');
            }}
          >
            Manage Rooms
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading dashboard data...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Bookings</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg
                        className="w-3 h-3 fill-current"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 0l6 6H8v6H4V6H0z" fillRule="evenodd" />
                      </svg>
                      <span className="ml-1">12%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">From previous period</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Active Bookings</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.activeBookings}</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Currently active</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <svg
                        className="w-3 h-3 fill-current"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 0l6 6H8v6H4V6H0z" fillRule="evenodd" />
                      </svg>
                      <span className="ml-1">8.2%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">From previous period</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Rooms</h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalRooms}</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Available for booking</p>
                </div>
              </div>
            )}
            
            {/* Recent Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Latest bookings in the system
                  </p>
                </div>
                
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Booking ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Guest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-in
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-out
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentBookings.length > 0 ? (
                          recentBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy-700">
                                {booking.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {booking.guestName || booking.user?.name || booking.userId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(booking.checkOut).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : booking.status === 'cancelled'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${booking.totalPrice}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                              No recent bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="py-6 bg-gray-800 text-white text-center mt-auto">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Moose Rock and Suites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}