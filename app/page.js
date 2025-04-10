'use client';

import Image from 'next/image';
import Header from '../src/components/Header';
import {RoomPhotos} from '../src/components/RoomPhotos';
import AvailabilitySearch from '../src/components/AvailabilitySearch';
import MapSection from '../src/components/MapSection';

// Constants for styling
const DARK_BLUE = '#26355D';
const LIGHT_GRAY_BG = '#D9D9D9';

export default function HomePage() {
 

  return (
    <div className="bg-white font-sans min-h-screen">
      {/* Header Component */}
      <Header />

      {/* Room Photos */}
     <RoomPhotos />
      
      {/* Check Availability Section */}
      <AvailabilitySearch />
      
      {/* Map Section */}
     <MapSection />

      {/* Footer */}
      <footer className="mt-10 p-6 text-center text-gray-600 bg-gray-100">
        <div className="container mx-auto">
          <p>© 2024 Moose Rock and Suites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 