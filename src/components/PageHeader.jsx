'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, User, ChevronDown, LogOut, BookOpen, Settings } from 'lucide-react';
import { useLocalization } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';

const PageHeader = () => {
  const pathname = usePathname();
  const { translate } = useLocalization();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Only show SecondaryNav on homepage
  const showSecondaryNav = pathname === '/';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      if (typeof logout === 'function') {
        await logout();
      } else {
        // Fallback
        window.location.href = '/api/auth/signout?callbackUrl=/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Top navigation bar */}
      <div className="bg-white py-3 border-b">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/assets/images/lotus-logo.svg"
                alt="MRS Logo"
                width={50}
                height={50}
                className="mr-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
            {user ? (
              // Logged in user menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-navy-700"
                >
                  <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-white">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:inline">{user.name || user.email}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Non-logged in links
              <Link href="/login" className="text-gray-700 hover:text-navy-700">
                Login
              </Link>
            )}
            <Link href="/my-bookings" className="text-gray-700 hover:text-navy-700">
              My booking
            </Link>
            <Link href="/customer-service" className="text-gray-700 hover:text-navy-700">
              Customer Service
            </Link>
            <div className="pl-2 border-l border-gray-300">
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-700 cursor-pointer"
                defaultValue="CAD"
              >
                <option value="CAD">CAD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-700 cursor-pointer"
                defaultValue="English"
              >
                <option value="English">English</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
              </select>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              {user ? (
                // Logged in mobile options
                <>
                  <div className="flex items-center py-2">
                    <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-white mr-2">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-gray-700">{user.name || user.email}</span>
                  </div>
                  <Link
                    href="/profile"
                    className="py-2 text-gray-700 hover:text-navy-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/my-bookings"
                    className="py-2 text-gray-700 hover:text-navy-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link
                      href="/admin"
                      className="py-2 text-gray-700 hover:text-navy-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-2 text-left text-gray-700 hover:text-navy-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Non-logged in mobile option
                <Link
                  href="/login"
                  className="py-2 text-gray-700 hover:text-navy-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                href="/my-bookings"
                className="py-2 text-gray-700 hover:text-navy-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My booking
              </Link>
              <Link
                href="/customer-service"
                className="py-2 text-gray-700 hover:text-navy-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Customer Service
              </Link>
              <div className="py-2">
                <select
                  className="bg-transparent border-none focus:ring-0 text-gray-700"
                  defaultValue="CAD"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="py-2">
                <select
                  className="bg-transparent border-none focus:ring-0 text-gray-700"
                  defaultValue="English"
                >
                  <option value="English">English</option>
                  <option value="French">Français</option>
                  <option value="Spanish">Español</option>
                </select>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Hotel name and address bar */}
      <header className="bg-navy-700 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-1 font-averia uppercase">
            MOOSE ROCK AND SUITES
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-lg">
            <p>117 Carrington Avenue BC</p>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <p>342 709 4565</p>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation (Main Menu) */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto">
            <Link href="/photos" className={`whitespace-nowrap px-4 py-3 font-medium ${pathname === '/photos' ? 'text-navy-700 border-b-2 border-navy-700' : 'text-gray-700 hover:text-navy-700'}`}>
              Photos
            </Link>
            <Link href="/reviews" className={`whitespace-nowrap px-4 py-3 font-medium ${pathname === '/reviews' ? 'text-navy-700 border-b-2 border-navy-700' : 'text-gray-700 hover:text-navy-700'}`}>
              Reviews
            </Link>
            <Link href="/map" className={`whitespace-nowrap px-4 py-3 font-medium ${pathname === '/map' ? 'text-navy-700 border-b-2 border-navy-700' : 'text-gray-700 hover:text-navy-700'}`}>
              Map
            </Link>
            <Link href="/hotel-facilities" className={`whitespace-nowrap px-4 py-3 font-medium ${pathname === '/hotel-facilities' ? 'text-navy-700 border-b-2 border-navy-700' : 'text-gray-700 hover:text-navy-700'}`}>
              Hotel Facilities
            </Link>
            <Link href="/hotel-information" className={`whitespace-nowrap px-4 py-3 font-medium ${pathname === '/hotel-information' ? 'text-navy-700 border-b-2 border-navy-700' : 'text-gray-700 hover:text-navy-700'}`}>
              Hotel Information
            </Link>
            <Link href="/hotel-policies" className={`whitespace-nowrap px-4 py-3 font-medium ${pathname === '/hotel-policies' ? 'text-navy-700 border-b-2 border-navy-700' : 'text-gray-700 hover:text-navy-700'}`}>
              Hotel Policies
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default PageHeader;