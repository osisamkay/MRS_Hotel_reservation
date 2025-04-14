'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocalization } from '../contexts/LocalizationContext';
import { useSession } from 'next-auth/react';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';

export default function Navigation() {
  const pathname = usePathname();
  const { translate } = useLocalization();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const publicRoutes = [
    { path: '/', label: 'home' },
    { path: '/hotel-overview', label: 'hotelOverview' },
    { path: '/rooms', label: 'rooms' },
    { path: '/facilities', label: 'facilities' },
    { path: '/photos', label: 'photos' },
    { path: '/reviews', label: 'reviews' },
    { path: '/map', label: 'map' },
    { path: '/information', label: 'information' },
    { path: '/policies', label: 'policies' }
  ];

  const authenticatedRoutes = [
    { path: '/my-booking', label: 'myBooking' },
    { path: '/customer-service', label: 'customerService' }
  ];

  const adminRoutes = [
    { path: '/admin/dashboard', label: 'adminDashboard' },
    { path: '/admin/rooms', label: 'manageRooms' },
    { path: '/admin/promotions', label: 'managePromotions' }
  ];

  const staffRoutes = [
    { path: '/staff/dashboard', label: 'staffDashboard' },
    { path: '/staff/check-ins', label: 'checkIns' },
    { path: '/staff/check-outs', label: 'checkOuts' }
  ];

  const superAdminRoutes = [
    { path: '/super-admin/dashboard', label: 'superAdminDashboard' },
    { path: '/super-admin/users', label: 'manageUsers' },
    { path: '/super-admin/system-logs', label: 'systemLogs' }
  ];

  const getRoutesForRole = () => {
    if (!session) return publicRoutes;

    switch (session.user.role) {
      case 'SUPER_ADMIN':
        return [...publicRoutes, ...superAdminRoutes];
      case 'ADMIN':
        return [...publicRoutes, ...adminRoutes];
      case 'STAFF':
        return [...publicRoutes, ...staffRoutes];
      default:
        return [...publicRoutes, ...authenticatedRoutes];
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">MRS Hotel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getRoutesForRole().map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`${pathname === route.path
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
                  } px-3 py-2 text-sm font-medium`}
              >
                {translate(route.label)}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <CurrencySelector />

            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <span className="text-gray-700">{session.user.name}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {translate('profile')}
                    </Link>
                    <Link
                      href="/api/auth/signout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {translate('signOut')}
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                {translate('login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {getRoutesForRole().map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`${pathname === route.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                    } block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {translate(route.label)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}