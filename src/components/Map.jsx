import React from 'react';

export function Map() {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-center mb-6">Map</h2>
      <div className="bg-blue-100 h-96 relative">
        <img src="/map.jpg" alt="Map" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}