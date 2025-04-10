import React from 'react';
import Image from 'next/image';

export function RoomPhotos() {
  return (
      <div className="container  mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[200px] md:h-[340px] relative rounded-lg overflow-hidden">
            <Image
              src="/assets/images/room-photo-1.svg"
              alt="Room with ocean view"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-[200px] md:h-[340px] relative rounded-lg overflow-hidden">
            <Image
              src="/assets/images/room-photo-2.svg"
              alt="Room with mountain view"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
  );
}