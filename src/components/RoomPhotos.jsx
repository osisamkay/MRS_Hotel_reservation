'use client';

import React from 'react';
import Image from 'next/image';

export function RoomPhotos() {
  return (
    <div className="container mx-auto  px-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-20 gap-4">
        <div className="relative h-[240px] md:h-[320px] overflow-hidden">
          <Image
            src="/assets/images/room-photo-1.svg"
            alt="Hotel Room with Ocean View"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="relative h-[240px] md:h-[320px] overflow-hidden">
          <Image
            src="/assets/images/room-photo-2.svg"
            alt="Hotel Suite with Mountain View"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default RoomPhotos;