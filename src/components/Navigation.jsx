import React from 'react';

export function Navigation() {
  return (
    <nav className="flex border-b">
      <a href="#" className="p-4 hover:bg-gray-100">Photos</a>
      <a href="#" className="p-4 hover:bg-gray-100">Reviews</a>
      <a href="#" className="p-4 hover:bg-gray-100">Map</a>
      <a href="#" className="p-4 hover:bg-gray-100">Hotel Facilities</a>
      <a href="#" className="p-4 hover:bg-gray-100">Hotel Information</a>
      <a href="#" className="p-4 hover:bg-gray-100">Hotel Policies</a>
    </nav>
  );
}