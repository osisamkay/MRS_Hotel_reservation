'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRooms: 0,
        activeBookings: 0,
        revenue: 0
    });

    useEffect(() => {
        // Fetch dashboard statistics
        const fetchStats = async () => {
            try {
                const [users, rooms, bookings] = await Promise.all([
                    fetch('/api/users').then(res => res.json()),
                    fetch('/api/rooms').then(res => res.json()),
                    fetch('/api/bookings').then(res => res.json())
                ]);

                const activeBookings = bookings.filter(b =>
                    b.status === 'confirmed' && new Date(b.checkOut) > new Date()
                );

                const revenue = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);

                setStats({
                    totalUsers: users.length,
                    totalRooms: rooms.length,
                    activeBookings: activeBookings.length,
                    revenue
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Management Dashboard
                    </h2>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalRooms}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Bookings</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.activeBookings}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                                    <dd className="text-lg font-medium text-gray-900">${stats.revenue}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <Link
                            href="/admin/users/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Add User
                        </Link>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            Remove User
                        </Link>
                        <Link
                            href="/admin/rooms/add"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                            Add Room
                        </Link>
                        <Link
                            href="/admin/bookings"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                            View Bookings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 