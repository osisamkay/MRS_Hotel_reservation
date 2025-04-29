'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Hotel, 
  Users, 
  Calendar, 
  CreditCard, 
  Star, 
  TrendingUp, 
  BarChart2, 
  Percent,
  CheckCircle,
  Clock,
  XCircle,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  occupancyRate: number;
  bookingGrowth: number;
  currentMonthBookings: number;
  previousMonthBookings: number;
  bookingsByStatus: Array<{
    status: string;
    count: number;
  }>;
  topRooms: Array<{
    id: string;
    name: string;
    price: number;
    _count: {
      bookings: number;
    }
  }>;
  recentBookings: Array<{
    id: string;
    guestName: string;
    roomName: string;
    checkIn: string;
    status: string;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    guestName: string;
    roomName: string;
    createdAt: string;
  }>;
}

const StatCard = ({ title, value, icon: Icon, trend = null, description = null }: { 
  title: string; 
  value: number | string; 
  icon: any;
  trend?: { value: number; isPositive: boolean } | null;
  description?: string | null;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${trend.isPositive ? '' : 'transform rotate-180'}`} />
            <span>{trend.value.toFixed(1)}% {trend.isPositive ? 'increase' : 'decrease'}</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  </div>
);

const StatusPill = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-100 text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'confirmed':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100 text-yellow-800';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100 text-red-800';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {status}
    </span>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated' || !session?.user?.role || 
        !['admin', 'super_admin'].includes(session.user.role)) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-navy-700 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Format the booking status data for display
  const statusCounts = {
    confirmed: 0,
    pending: 0,
    cancelled: 0
  };
  
  stats.bookingsByStatus.forEach((item: any) => {
    if (statusCounts.hasOwnProperty(item.status)) {
      statusCounts[item.status as keyof typeof statusCounts] = Number(item.count);
    }
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {session?.user?.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Here's what's happening with your hotel today.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={CreditCard} 
        />
        <StatCard 
          title="Bookings" 
          value={stats.totalBookings} 
          icon={Calendar} 
          trend={{
            value: stats.bookingGrowth,
            isPositive: stats.bookingGrowth >= 0
          }}
          description={`${stats.currentMonthBookings} this month, ${stats.previousMonthBookings} last month`}
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${stats.occupancyRate.toFixed(1)}%`} 
          icon={Percent} 
        />
        <StatCard 
          title="Average Rating" 
          value={stats.averageRating.toFixed(1)} 
          icon={Star} 
        />
      </div>

      {/* Booking Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.confirmed}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">{statusCounts.cancelled}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rooms and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rooms */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Rooms</h2>
            <Link href="/admin/rooms" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.topRooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-md mr-3">
                    <Hotel className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{room.name}</p>
                    <p className="text-sm text-gray-500">${room.price} per night</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium">{room._count.bookings} bookings</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Overview</h2>
            <div className="flex space-x-2">
              <Link href="/admin/rooms" className="text-sm text-blue-600 hover:text-blue-800">
                Rooms
              </Link>
              <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-800">
                Users
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Hotel className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Rooms</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalRooms}</p>
                  <p className="text-xs text-gray-500">
                    {stats.occupancyRate.toFixed(1)}% currently occupied
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500">
                    Customers, staff and administrators
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{booking.guestName}</p>
                  <p className="text-sm text-gray-500">{booking.roomName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  <StatusPill status={booking.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            <Link href="/admin/reviews" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentReviews.map((review) => (
              <div key={review.id} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900 mr-2">{review.guestName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{review.comment}</p>
                  <p className="text-xs text-gray-400">{review.roomName}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/rooms/add" className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="flex flex-col items-center text-center">
              <Hotel className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add Room</p>
            </div>
          </Link>
          <Link href="/admin/users/add" className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
            <div className="flex flex-col items-center text-center">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Add User</p>
            </div>
          </Link>
          <Link href="/admin/bookings" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Bookings</p>
            </div>
          </Link>
          <Link href="/admin/rooms" className="bg-orange-50 p-4 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="flex flex-col items-center text-center">
              <BarChart2 className="h-8 w-8 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Rooms</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
