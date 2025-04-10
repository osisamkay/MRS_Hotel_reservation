import React, { useState } from 'react';
import { Calendar } from './Calendar';
import { GuestSelector } from './GuestSelector';

export function BookingForm() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [seniors, setSeniors] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("April 2025");
  
  // Selected dates
  const selectedDates = { start: 13, end: 15 };
  
  const prevMonth = () => {
    setCurrentMonth("April 2025");
  };
  
  const nextMonth = () => {
    setCurrentMonth("May 2025");
  };
  
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold text-center mb-6 text-indigo-900">Check Availability for MRS Hotel</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2">Check-In date</label>
          <input 
            type="text" 
            className="w-full border p-3" 
            placeholder="Select check-in date" 
            value={checkInDate} 
            onChange={(e) => setCheckInDate(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block mb-2">Check-Out date</label>
          <input 
            type="text" 
            className="w-full border p-3" 
            placeholder="Select check-out date" 
            value={checkOutDate} 
            onChange={(e) => setCheckOutDate(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block mb-2">Guests</label>
          <input type="text" className="w-full border p-3" placeholder="Number of guests" />
        </div>
        
        <div>
          <label className="block mb-2">Rooms</label>
          <input type="text" className="w-full border p-3" placeholder="Number of rooms" />
        </div>
      </div>
      
      {/* Calendar */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Calendar 
          month="April 2025" 
          onPrevMonth={prevMonth} 
          onNextMonth={nextMonth} 
          selectedDates={selectedDates} 
        />
        
        <Calendar 
          month="May 2025" 
          onPrevMonth={prevMonth} 
          onNextMonth={nextMonth} 
          selectedDates={selectedDates} 
        />
      </div>
      
      {/* Room Selection */}
      <div className="bg-gray-200 p-6 rounded-md mb-6">
        <GuestSelector 
          label="Rooms" 
          value={rooms} 
          onDecrement={() => setRooms(rooms - 1)} 
          onIncrement={() => setRooms(rooms + 1)} 
          minValue={1} 
        />
        
        <GuestSelector 
          label="Adults" 
          value={guests} 
          onDecrement={() => setGuests(guests - 1)} 
          onIncrement={() => setGuests(guests + 1)} 
          minValue={1} 
        />
        
        <GuestSelector 
          label="Seniors (60+)" 
          value={seniors} 
          onDecrement={() => setSeniors(seniors - 1)} 
          onIncrement={() => setSeniors(seniors + 1)} 
        />
      </div>
      
      {/* Selected Dates Summary */}
      <div className="flex justify-between mb-6">
        <div className="border border-gray-300 p-3 text-center">
          <span className="block">Apr 13 to Apr 15</span>
        </div>
        <div className="border border-gray-300 p-3 text-center">
          <span className="block">{rooms} room  {guests} adults  {seniors} seniors</span>
        </div>
      </div>
      
      {/* Check Availability Button */}
      <button className="w-full bg-indigo-900 text-white py-4 font-medium">
        Check Availability
      </button>
    </div>
  );
}