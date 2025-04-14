'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AvailabilitySearch() {
  const router = useRouter();
  
  // State for form inputs
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [seniors, setSeniors] = useState(0);
  
  // Calendar display states
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [nextMonth, setNextMonth] = useState((new Date().getMonth() + 1) % 12);
  const [nextMonthYear, setNextMonthYear] = useState(
    new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear()
  );
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  
  // Set default selected dates (current date + 2 days)
  useEffect(() => {
    const today = new Date();
    
    // Set April 13, 2025 as the start date
    const startDate = new Date(2025, 3, 13); // April is month 3 (0-indexed)
    setSelectedStartDate(startDate);
    
    // Set April 15, 2025 as the end date
    const endDate = new Date(2025, 3, 15);
    setSelectedEndDate(endDate);
    
    // Set current display to April 2025
    setCurrentMonth(3); // April
    setCurrentYear(2025);
    setNextMonth(4); // May
    setNextMonthYear(2025);
  }, []);
  
  // Adjust next month whenever current month changes
  useEffect(() => {
    setNextMonth((currentMonth + 1) % 12);
    setNextMonthYear(currentMonth === 11 ? currentYear + 1 : currentYear);
  }, [currentMonth, currentYear]);
  
  // Handle prev/next month navigation
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Generate calendar data for a given month and year
  const generateCalendarDays = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
    
    return {
      name: `${monthName} ${year}`,
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      firstDay,
    };
  };
  
  // Check if a date is selected
  const isDateSelected = (day, month, year) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    
    const date = new Date(year, month, day);
    return (
      date >= selectedStartDate &&
      date <= selectedEndDate
    );
  };
  
  // Check if a specific date is today
  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  // Check if a date is the selected start date
  const isStartDate = (day, month, year) => {
    if (!selectedStartDate) return false;
    
    return (
      day === selectedStartDate.getDate() &&
      month === selectedStartDate.getMonth() &&
      year === selectedStartDate.getFullYear()
    );
  };
  
  // Check if a date is the selected end date
  const isEndDate = (day, month, year) => {
    if (!selectedEndDate) return false;
    
    return (
      day === selectedEndDate.getDate() &&
      month === selectedEndDate.getMonth() &&
      year === selectedEndDate.getFullYear()
    );
  };
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (selectedStartDate && selectedEndDate) {
      const searchParams = new URLSearchParams({
        checkIn: selectedStartDate.toISOString(),
        checkOut: selectedEndDate.toISOString(),
        adults,
        seniors,
        rooms
      });
      
      router.push(`/search-rooms?${searchParams.toString()}`);
    }
  };
  
  // Format a date for display: Apr 13 to Apr 15
  const formatDateRange = () => {
    if (!selectedStartDate || !selectedEndDate) return '';
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    };
    
    return `${formatDate(selectedStartDate)} to ${formatDate(selectedEndDate)}`;
  };
  
  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-center text-2xl font-bold my-6">Check Availability for MRS Hotel</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Check-In date</label>
          <input 
            type="text" 
            className="w-full p-3 border border-gray-300 bg-gray-100 rounded" 
            readOnly
            value={selectedStartDate ? selectedStartDate.toLocaleDateString() : ''}
            onClick={() => setShowCalendar(true)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Check-Out date</label>
          <input 
            type="text" 
            className="w-full p-3 border border-gray-300 bg-gray-100 rounded" 
            readOnly
            value={selectedEndDate ? selectedEndDate.toLocaleDateString() : ''}
            onClick={() => setShowCalendar(true)}
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Guests</label>
          <input 
            type="number" 
            className="w-full p-3 border border-gray-300 bg-gray-100 rounded" 
            value={adults + seniors}
            onChange={(e) => {
              const total = parseInt(e.target.value);
              if (total >= seniors) {
                setAdults(total - seniors);
              } else {
                setAdults(0);
                setSeniors(total);
              }
            }}
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Rooms</label>
          <input 
            type="number" 
            className="w-full p-3 border border-gray-300 bg-gray-100 rounded" 
            value={rooms}
            onChange={(e) => setRooms(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
          />
        </div>
      </div>
      
      {showCalendar && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={goToPrevMonth} className="p-1 hover:bg-gray-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <p className="font-semibold">Select your dates</p>
              {selectedStartDate && selectedEndDate && (
                <p className="text-sm text-navy-700">{formatDateRange()}</p>
              )}
            </div>
            
            <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Month Calendar */}
            <div>
              <div className="mb-2 text-center font-medium">
                {generateCalendarDays(currentMonth, currentYear).name}
              </div>
              <div className="grid grid-cols-7 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-gray-500 text-sm p-1">{day}</div>
                ))}
                
                {Array(generateCalendarDays(currentMonth, currentYear).firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {generateCalendarDays(currentMonth, currentYear).days.map((day) => {
                  const isSelected = isDateSelected(day, currentMonth, currentYear);
                  const isStart = isStartDate(day, currentMonth, currentYear);
                  const isEnd = isEndDate(day, currentMonth, currentYear);
                  const isTodayDate = isToday(day, currentMonth, currentYear);
                  
                  return (
                    <div 
                      key={`day-${day}`} 
                      className={`p-2 cursor-pointer text-center ${
                        isSelected ? 'bg-navy-700 text-white' : ''
                      } ${isStart || isEnd ? 'bg-navy-800 text-white' : ''} ${
                        isTodayDate && !isSelected ? 'border border-navy-700' : ''
                      } hover:bg-gray-100 rounded-full`}
                      onClick={() => {
                        const date = new Date(currentYear, currentMonth, day);
                        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                          setSelectedStartDate(date);
                          setSelectedEndDate(null);
                        } else {
                          if (date < selectedStartDate) {
                            setSelectedEndDate(selectedStartDate);
                            setSelectedStartDate(date);
                          } else {
                            setSelectedEndDate(date);
                          }
                        }
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Next Month Calendar */}
            <div>
              <div className="mb-2 text-center font-medium">
                {generateCalendarDays(nextMonth, nextMonthYear).name}
              </div>
              <div className="grid grid-cols-7 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-gray-500 text-sm p-1">{day}</div>
                ))}
                
                {Array(generateCalendarDays(nextMonth, nextMonthYear).firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                
                {generateCalendarDays(nextMonth, nextMonthYear).days.map((day) => {
                  const isSelected = isDateSelected(day, nextMonth, nextMonthYear);
                  const isStart = isStartDate(day, nextMonth, nextMonthYear);
                  const isEnd = isEndDate(day, nextMonth, nextMonthYear);
                  const isTodayDate = isToday(day, nextMonth, nextMonthYear);
                  
                  return (
                    <div 
                      key={`next-day-${day}`} 
                      className={`p-2 cursor-pointer text-center ${
                        isSelected ? 'bg-navy-700 text-white' : ''
                      } ${isStart || isEnd ? 'bg-navy-800 text-white' : ''} ${
                        isTodayDate && !isSelected ? 'border border-navy-700' : ''
                      } hover:bg-gray-100 rounded-full`}
                      onClick={() => {
                        const date = new Date(nextMonthYear, nextMonth, day);
                        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                          setSelectedStartDate(date);
                          setSelectedEndDate(null);
                        } else {
                          if (date < selectedStartDate) {
                            setSelectedEndDate(selectedStartDate);
                            setSelectedStartDate(date);
                          } else {
                            setSelectedEndDate(date);
                          }
                        }
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="bg-gray-100 p-4 rounded-lg mb-4 md:mb-0">
              <div className="grid grid-cols-1 gap-4">
                {/* Rooms adjustment */}
                <div className="flex items-center justify-between">
                  <div className="font-medium">Rooms</div>
                  <div className="flex items-center">
                    <button 
                      className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center"
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                    >
                      -
                    </button>
                    <span className="mx-3">{rooms}</span>
                    <button 
                      className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center"
                      onClick={() => setRooms(rooms + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Adults adjustment */}
                <div className="flex items-center justify-between">
                  <div className="font-medium">Adults</div>
                  <div className="flex items-center">
                    <button 
                      className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </button>
                    <span className="mx-3">{adults}</span>
                    <button 
                      className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Seniors adjustment */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Seniors</div>
                    <div className="text-xs text-gray-500">(60+)</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center"
                      onClick={() => setSeniors(Math.max(0, seniors - 1))}
                    >
                      -
                    </button>
                    <span className="mx-3">{seniors}</span>
                    <button 
                      className="w-7 h-7 bg-gray-700 text-white rounded-full flex items-center justify-center"
                      onClick={() => setSeniors(seniors + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto md:min-w-[200px]">
              <div className="p-3 bg-gray-100 border-2 border-navy-700 text-center font-medium rounded mb-3">
                {formatDateRange() || 'Select dates'}
              </div>
              
              <div className="p-3 bg-gray-100 border-2 border-navy-700 text-center font-medium rounded">
                {rooms} room · {adults} {adults === 1 ? 'adult' : 'adults'} · {seniors} {seniors === 1 ? 'senior' : 'seniors'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => {
          setShowCalendar(false);
          handleSearch(new Event('click'));
        }}
        className="w-full py-3 px-4 bg-navy-700 text-white font-medium rounded hover:bg-navy-800 transition-colors"
      >
        Check Availability
      </button>
    </div>
  );
}