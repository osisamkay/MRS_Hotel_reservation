'use client';

import React from 'react';
import Image from 'next/image';

const MapSection = () => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <h2 className="text-2xl font-bold text-center mb-6">Map</h2>
      
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
        <Image
          src="/assets/images/map.jpg"
          alt="Hotel location on map"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default MapSection;