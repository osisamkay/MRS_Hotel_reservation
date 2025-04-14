'use client';

import PageHeader from '@/src/components/PageHeader';
import RoomPhotos from '@/src/components/RoomPhotos';
import AvailabilitySearch from '@/src/components/AvailabilitySearch';
import MapSection from '@/src/components/MapSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader />
      <main>
        <RoomPhotos />
        <AvailabilitySearch />
        <MapSection />
      </main>
      
      <footer className="bg-navy-700 text-white py-4 text-center">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Moose Rock and Suites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}