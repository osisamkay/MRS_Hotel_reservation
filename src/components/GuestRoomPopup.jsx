import React from 'react';

const GuestRoomPopup = ({ guests, setGuests, rooms, setRooms, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Select Guests & Rooms</h3>
        
        <div className="space-y-4">
          {/* Adults */}
          <div className="flex justify-between items-center">
            <span>Adults</span>
            <div className="flex items-center space-x-4">
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
              >-</button>
              <span>{guests.adults}</span>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
              >+</button>
            </div>
          </div>

          {/* Children */}
          <div className="flex justify-between items-center">
            <span>Children</span>
            <div className="flex items-center space-x-4">
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
              >-</button>
              <span>{guests.children}</span>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}
              >+</button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex justify-between items-center">
            <span>Rooms</span>
            <div className="flex items-center space-x-4">
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setRooms(prev => Math.max(1, prev - 1))}
              >-</button>
              <span>{rooms}</span>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setRooms(prev => prev + 1)}
              >+</button>
            </div>
          </div>
        </div>

        <button className="btn-primary mt-6 w-full" onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default GuestRoomPopup; 