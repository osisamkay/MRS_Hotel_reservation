'use client';

import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '../contexts/LocalizationContext';
import Navigation from './Navigation';
import ErrorHandler from './ErrorHandler';
import { useState } from 'react';

export default function Layout({ children }) {
  const [error, setError] = useState(null);

  return (
    <SessionProvider>
      <LocalizationProvider>
        <div className="min-h-screen flex flex-col">
          {/* <Navigation /> */}
          <main className="flex-grow">
            {error ? (
              <ErrorHandler message={error} onClose={() => setError(null)} />
            ) : (
              children
            )}
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">MRS Hotel</h3>
                  <p className="text-gray-400">
                    Luxury accommodations in British Columbia
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="/rooms" className="text-gray-400 hover:text-white">
                        Rooms
                      </a>
                    </li>
                    <li>
                      <a href="/facilities" className="text-gray-400 hover:text-white">
                        Facilities
                      </a>
                    </li>
                    <li>
                      <a href="/information" className="text-gray-400 hover:text-white">
                        Information
                      </a>
                    </li>
                    <li>
                      <a href="/policies" className="text-gray-400 hover:text-white">
                        Policies
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li>123 Mountain View Road</li>
                    <li>British Columbia, Canada</li>
                    <li>Phone: +1 (555) 123-4567</li>
                    <li>Email: info@mrshotel.com</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">
                      Facebook
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Instagram
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} MRS Hotel. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </LocalizationProvider>
    </SessionProvider>
  );
} 