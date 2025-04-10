import React from 'react';
import Image from 'next/image';

const MapSection = () => {
  return (
     <div className="container mx-auto px-4  py-4 mb-16">
        <h2 className="text-2xl font-bold mb-6 mt-20 text-center">Map</h2>
        <div className="relative h-[300px] lg:h-[946px] w-full rounded-lg overflow-hidden">
          <Image
            src="/assets/images/map-preview.svg"
            alt="Hotel location on map"
            fill
            className="object-cover"
          />
        </div>
      </div>
  );
};

export default MapSection; 