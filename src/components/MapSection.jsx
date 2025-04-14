'use client';

import React from 'react';
import Image from 'next/image';

const MapSection = () => {
  return (
    <div className="container mx-auto px-4 mb-20 ">
      <h2 className="text-2xl font-bold text-center mt-20 mb-6">Map</h2>

      <div className="relative w-full h-[500px] mb-20 rounded-lg overflow-hidden">
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