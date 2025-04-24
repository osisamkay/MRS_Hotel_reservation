// src/components/skeletons/RoomDetailsSkeleton.tsx
import React from 'react';

/**
 * Skeleton loader for the room details page
 * Provides a nice loading experience while room data is being fetched
 */
const RoomDetailsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <div className="h-96 w-full bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-6">
        <div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-5 bg-gray-200 rounded w-28"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-36 mb-4"></div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-5 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>

        {/* Booking Form Skeleton */}
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="h-32 bg-gray-200 rounded w-full mb-6"></div>
          
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsSkeleton;