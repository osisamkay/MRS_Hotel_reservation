'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SecondaryNav from './SecondaryNav';

const PageHeader = () => {
  const pathname = usePathname();
  
  // Only show SecondaryNav on homepage and hotel-overview page
  const showSecondaryNav = pathname === '/' || pathname === '/hotel-overview';
  
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
                width={87}
                height={87}
                className="mr-2"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-md font-semibold">
            <Link href="/login" className="text-gray-700 hover:text-navy-700">Login</Link>
            <Link href="/my-booking" className="text-gray-700 hover:text-navy-700">My booking</Link>
            <Link href="/customer-service" className="text-gray-700 hover:text-navy-700">Customer Service</Link>
            <Link href="#" className="text-gray-700 hover:text-navy-700">CAD</Link>
            <Link href="#" className="text-gray-700 hover:text-navy-700">English</Link>
          </nav>
        </div>
      </div>
      
      {/* Hotel name and address bar */}
      <header className="bg-navy-700 text-white py-5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-7xl font-bold mb-1 font-serif">MOOSE ROCK AND SUITES</h1>
          <div className="max-w-[54rem] mx-auto flex items-center justify-between font-serif text-3xl">
            <p className="mr-4">117 Carrington Avenue BC</p>
            <div className="flex items-center justify-center">
              <Image
                src="/assets/images/call.svg"
                alt="Phone"
                width={32}
                height={32}
                className="mr-2"
              />
              <p>342 709 4565</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Conditionally render SecondaryNav */}
      {showSecondaryNav && <SecondaryNav />}
    </>
  );
};

export default PageHeader; 