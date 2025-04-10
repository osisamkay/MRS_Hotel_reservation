import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar({ month, onPrevMonth, onNextMonth, selectedDates }) {
  const isApril = month === "April 2025";
  const daysInMonth = isApril ? 30 : 31;
  const startDay = isApril ? 2 : 4; // 0=Sunday ... 6=Saturday
  
  // Create array of days with proper offset
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  const isSelectedDate = (day) => {
    if (!day) return false;
    if (isApril) {
      return day === selectedDates.start || day === selectedDates.end;
    }
    return false;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {isApril ? (
          <>
            <button onClick={onPrevMonth} className="p-2"><ChevronLeft size={20} /></button>
            <h3 className="font-medium">{month}</h3>
            <div className="w-6"></div>
          </>
        ) : (
          <>
            <div className="w-6"></div>
            <h3 className="font-medium">{month}</h3>
            <button onClick={onNextMonth} className="p-2"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-7 text-center mb-2">
        <div className="text-sm font-medium">S</div>
        <div className="text-sm font-medium">M</div>
        <div className="text-sm font-medium">T</div>
        <div className="text-sm font-medium">W</div>
        <div className="text-sm font-medium">T</div>
        <div className="text-sm font-medium">F</div>
        <div className="text-sm font-medium">S</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, index) => (
          <div key={index} className={`h-8 ${!day ? '' : 
            isSelectedDate(day) ? 'bg-indigo-900 text-white rounded-full flex items-center justify-center' : 
            'flex items-center justify-center'}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}