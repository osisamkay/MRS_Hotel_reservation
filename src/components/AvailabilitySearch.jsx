import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AvailabilitySearch = () => {
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(2);
    const [seniors, setSeniors] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectionMode, setSelectionMode] = useState('start'); // 'start' or 'end'
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Index of first visible month
    const [currentYear, setCurrentYear] = useState(2025);
    const [showGuestOptions, setShowGuestOptions] = useState(false);
    const [checkInInput, setCheckInInput] = useState('');
    const [checkOutInput, setCheckOutInput] = useState('');
  
    // Calendar data - dynamically generate months
    const getMonthData = (month, year) => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Calculate first day of month (0 = Sunday, 1 = Monday, etc.)
      const firstDay = new Date(year, month, 1).getDay();
      
      // Calculate number of days in month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      return {
        name: `${monthNames[month]} ${year}`,
        days: daysInMonth,
        firstDay: firstDay,
        month,
        year
      };
    };
    
    // Generate months for display in calendar (current month and next month)
    const getMonthsForDisplay = () => {
      const months = [];
      // Display 2 months at a time instead of 4
      for (let i = 0; i < 2; i++) {
        let monthIndex = (currentMonthIndex + i) % 12;
        let yearOffset = Math.floor((currentMonthIndex + i) / 12);
        let year = currentYear + yearOffset;
        months.push(getMonthData(monthIndex, year));
      }
      return months;
    };

  // Format date for display
  const formatDate = (day, month, year) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${monthNames[month]} ${year}`;
  };

  // Navigate to previous months
  const goToPreviousMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  // Navigate to next months
  const goToNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };
  
  // Navigate to previous year
  const goToPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };
  
  // Navigate to next year
  const goToNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  // Handle date selection
  const handleDateSelect = (day, month, year) => {
    if (selectionMode === 'start') {
      setStartDate({ day, month, year });
      setSelectionMode('end');
      setEndDate(null);
    } else {
      // If selecting end date before start date, swap them
      const startTimestamp = new Date(startDate.year, startDate.month, startDate.day).getTime();
      const clickedTimestamp = new Date(year, month, day).getTime();
      
      if (clickedTimestamp < startTimestamp) {
        setEndDate({ ...startDate });
        setStartDate({ day, month, year });
      } else {
        setEndDate({ day, month, year });
      }
      setSelectionMode('start');
    }
  };

  // Check if a date is selected (either start or within range)
  const isDateSelected = (day, month, year) => {
    if (!startDate) return false;
    
    // Convert dates to timestamps for easy comparison
    const dateTimestamp = new Date(year, month, day).getTime();
    const startTimestamp = new Date(startDate.year, startDate.month, startDate.day).getTime();
    
    // If no end date is selected, only check if it's the start date
    if (!endDate) return dateTimestamp === startTimestamp;
    
    // Check if date is within range
    const endTimestamp = new Date(endDate.year, endDate.month, endDate.day).getTime();
    return dateTimestamp >= startTimestamp && dateTimestamp <= endTimestamp;
  };

  // Check if date is start or end specifically (for styling)
  const isStartDate = (day, month, year) => {
    return startDate && 
      startDate.day === day && 
      startDate.month === month && 
      startDate.year === year;
  };
  
  const isEndDate = (day, month, year) => {
    return endDate && 
      endDate.day === day && 
      endDate.month === month && 
      endDate.year === year;
  };

  // Check if a date is today
  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const renderCalendar = (monthData) => {
    const daysArray = Array.from({ length: monthData.days }, (_, i) => i + 1);
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    // Add empty cells for days before the 1st
    const emptyCells = Array.from({ length: monthData.firstDay }, (_, i) => null);
    const calendarDays = [...emptyCells, ...daysArray];
    
    return (
      <div className="w-full mb-6">
        <div className="mb-2 text-center font-medium">{monthData.name}</div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdays.map((day, i) => (
            <div key={`head-${i}`} className="text-xs font-medium py-1">{day}</div>
          ))}
          
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="py-2"></div>;
            
            const isSelected = isDateSelected(day, monthData.month, monthData.year);
            const isStart = isStartDate(day, monthData.month, monthData.year);
            const isEnd = isEndDate(day, monthData.month, monthData.year);
            const today = isToday(day, monthData.month, monthData.year);
            
            return (
              <div 
                key={`day-${i}`} 
                className={`py-2 text-sm cursor-pointer rounded-full
                  ${isSelected ? 'bg-navy-700 text-white' : ''} 
                  ${isStart ? 'bg-navy-900 text-white' : ''}
                  ${isEnd ? 'bg-navy-900 text-white' : ''}
                  ${today && !isSelected ? 'border border-navy-700' : ''}
                  hover:bg-gray-100`}
                onClick={() => handleDateSelect(day, monthData.month, monthData.year)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Effect to initialize with default dates
  useEffect(() => {
    // Set default dates (today + 2 days)
    if (!startDate) {
      const today = new Date();
      const checkoutDate = new Date();
      checkoutDate.setDate(today.getDate() + 2);
      
      setStartDate({ 
        day: today.getDate(), 
        month: today.getMonth(), 
        year: today.getFullYear() 
      });
      
      setEndDate({ 
        day: checkoutDate.getDate(), 
        month: checkoutDate.getMonth(), 
        year: checkoutDate.getFullYear() 
      });
      
      setCurrentMonthIndex(today.getMonth());
      setCurrentYear(today.getFullYear());
    }
  }, []);

  // Format date string from object
  const formatDateFromObject = (dateObj) => {
    if (!dateObj) return 'Select date';
    return formatDate(dateObj.day, dateObj.month, dateObj.year);
  };

  // Calculate stay duration
  const calculateStayDuration = () => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate.year, startDate.month, startDate.day);
    const end = new Date(endDate.year, endDate.month, endDate.day);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    
    return days === 1 ? '1 night' : `${days} nights`;
  };

  // Update input fields when dates change
  useEffect(() => {
    if (startDate) {
      setCheckInInput(`${startDate.year}-${String(startDate.month + 1).padStart(2, '0')}-${String(startDate.day).padStart(2, '0')}`);
    }
    if (endDate) {
      setCheckOutInput(`${endDate.year}-${String(endDate.month + 1).padStart(2, '0')}-${String(endDate.day).padStart(2, '0')}`);
    }
  }, [startDate, endDate]);

  // Handle manual date input changes
  const handleCheckInInputChange = (e) => {
    setCheckInInput(e.target.value);
    try {
      const [year, month, day] = e.target.value.split('-').map(num => parseInt(num, 10));
      if (isValidDate(year, month - 1, day)) {
        setStartDate({ day, month: month - 1, year });
        // If end date is before new start date, adjust it
        if (endDate) {
          const newStartDate = new Date(year, month - 1, day);
          const currentEndDate = new Date(endDate.year, endDate.month, endDate.day);
          if (newStartDate > currentEndDate) {
            // Set end date to start date + 1 day
            const newEndDate = new Date(newStartDate);
            newEndDate.setDate(newEndDate.getDate() + 1);
            setEndDate({
              day: newEndDate.getDate(),
              month: newEndDate.getMonth(),
              year: newEndDate.getFullYear()
            });
          }
        }
      }
    } catch (error) {
      // Invalid date format, do nothing
    }
  };

  const handleCheckOutInputChange = (e) => {
    setCheckOutInput(e.target.value);
    try {
      const [year, month, day] = e.target.value.split('-').map(num => parseInt(num, 10));
      if (isValidDate(year, month - 1, day)) {
        // Only set if date is after start date
        if (startDate) {
          const newEndDate = new Date(year, month - 1, day);
          const currentStartDate = new Date(startDate.year, startDate.month, startDate.day);
          if (newEndDate >= currentStartDate) {
            setEndDate({ day, month: month - 1, year });
          }
        } else {
          setEndDate({ day, month: month - 1, year });
        }
      }
    } catch (error) {
      // Invalid date format, do nothing
    }
  };

  // Check if date is valid
  const isValidDate = (year, month, day) => {
    const date = new Date(year, month, day);
    return date.getFullYear() === year && 
           date.getMonth() === month && 
           date.getDate() === day;
  };

  return (
     <div className="container mx-auto px-4 py-4 mb-8">
        <h2 className="mt-20 mb-10 text-2xl font-bold mb-6 text-center text-navy-700">Check Availability for MRS Hotel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Check-In Date */}
          <div>
            <label className="block text-gray-700 mb-2">Check-In date</label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-gray-200 border border-gray-300 rounded p-2 h-12"
                value={checkInInput}
                onChange={handleCheckInInputChange}
              />
              <div 
                className="absolute top-0 right-0 bottom-0 flex items-center pr-2 cursor-pointer"
                onClick={() => {
                  setShowCalendar(true);
                  setSelectionMode('start');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Check-Out Date */}
          <div>
            <label className="block text-gray-700 mb-2">Check-Out date</label>
            <div className="relative">
              <input
                type="date"
                className="w-full bg-gray-200 border border-gray-300 rounded p-2 h-12"
                value={checkOutInput}
                onChange={handleCheckOutInputChange}
              />
              <div 
                className="absolute top-0 right-0 bottom-0 flex items-center pr-2 cursor-pointer"
                onClick={() => {
                  setShowCalendar(true);
                  setSelectionMode('end');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Guests */}
          <div>
            <label className="block text-gray-700 mb-2">Guests</label>
            <div className="relative">
              <input
                type="number"
                className="w-full bg-gray-200 border border-gray-300 rounded p-2 h-12"
                value={adults + seniors}
                onChange={(e) => {
                  const total = Math.max(1, parseInt(e.target.value, 10) || 0);
                  setAdults(total > seniors ? total - seniors : 1);
                }}
                min="1"
              />
              <div 
                className="absolute top-0 right-0 bottom-0 flex items-center pr-2 cursor-pointer"
                onClick={() => setShowGuestOptions(!showGuestOptions)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Rooms */}
          <div>
            <label className="block text-gray-700 mb-2">Rooms</label>
            <input
              type="number"
              className="w-full bg-gray-200 border border-gray-300 rounded p-2 h-12"
              value={rooms}
              onChange={(e) => setRooms(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
            />
          </div>
        </div>

        {/* Guest Options Dropdown */}
        {showGuestOptions && (
          <div className="mt-2 p-4 bg-white  relative z-10">
            <div className="flex bg-gray-200 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Adults Controls */}
                <div className="flex items-center">
                  <div className="mr-4">Adults</div>
                  <div className="flex items-center ml-auto">
                    <button 
                      className="w-8 h-8 bg-gray-800 text-white rounded-full"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >-</button>
                    <span className="mx-4">{adults}</span>
                    <button 
                      className="w-8 h-8 bg-gray-800 text-white rounded-full"
                      onClick={() => setAdults(adults + 1)}
                    >+</button>
                  </div>
                </div>
                
                {/* Seniors Controls */}
                <div className="flex items-center">
                  <div className="mr-4">
                    <div>Seniors</div>
                    <div className="text-xs text-gray-500">(60+)</div>
                  </div>
                  <div className="flex items-center ml-auto">
                    <button 
                      className="w-8 h-8 bg-gray-800 text-white rounded-full"
                      onClick={() => setSeniors(Math.max(0, seniors - 1))}
                    >-</button>
                    <span className="mx-4">{seniors}</span>
                    <button 
                      className="w-8 h-8 bg-gray-800 text-white rounded-full"
                      onClick={() => setSeniors(seniors + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-right">
              <button 
                className="bg-navy-700 text-white px-4 py-2 rounded"
                onClick={() => setShowGuestOptions(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
        
        {/* Calendar */}
        {showCalendar && (
          <div className="mt-6 p-4 ">
            <div className="flex justify-between items-center mb-4">
              {/* Calendar Navigation */}
              <div className="flex space-x-2">
                {/* <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={goToPreviousYear}
                  title="Previous Year"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M9.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button> */}
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={goToPreviousMonth}
                  title="Previous Month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col items-center w-full mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  {selectionMode === 'start' ? 'Select check-in date' : 'Select check-out date'}
                </p>
                {startDate && endDate && (
                  <div className="text-sm font-medium">
                    <span>{formatDateFromObject(startDate)} - {formatDateFromObject(endDate)}</span>
                    <span className="ml-2 text-navy-700">({calculateStayDuration()})</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={goToNextMonth}
                  title="Next Month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={goToNextYear}
                  title="Next Year"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button> */}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              {getMonthsForDisplay().map((monthData, index) => renderCalendar(monthData))}
            </div>
            
            <div className="rounded-lg flex sm:flex-row flex-col justify-between items-center w-full max-w-4xl p-4 mt-4 mx-auto">
              
              
              <div className="flex mb-10 sm:mb-0 bg-gray-200 p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4 font-bold ">
                  {/* Rooms Controls */}
                  <div className="flex items-center">
                    <div className="mr-4">Rooms</div>
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 bg-gray-800 text-white rounded-full"
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                      >-</button>
                      <span className="mx-4">{rooms}</span>
                      <button 
                        className="w-8 h-8 bg-gray-800 text-white rounded-full"
                        onClick={() => setRooms(rooms + 1)}
                      >+</button>
                    </div>
                  </div>
                  
                  {/* Adults Controls */}
                  <div className="flex items-center">
                    <div className="mr-4">Adults</div>
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 bg-gray-800 text-white rounded-full"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                      >-</button>
                      <span className="mx-4">{adults}</span>
                      <button 
                        className="w-8 h-8 bg-gray-800 text-white rounded-full"
                        onClick={() => setAdults(adults + 1)}
                      >+</button>
                    </div>
                  </div>
                  
                  {/* Seniors Controls */}
                  <div className="flex items-center font-bold">
                    <div className="mr-4">
                      <div>Seniors</div>
                      <div className="text-xs">(60+)</div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 bg-gray-800 text-white rounded-full"
                        onClick={() => setSeniors(Math.max(0, seniors - 1))}
                      >-</button>
                      <span className="mx-4">{seniors}</span>
                      <button 
                        className="w-8 h-8 bg-gray-800 text-white rounded-full"
                        onClick={() => setSeniors(seniors + 1)}
                      >+</button>
                    </div>
                  </div>
                </div>
            </div>
            <div className="items-center w-full max-w-[300px]  ">
                <div className="flex flex-col items-center">
                  {/* <div className="text-sm text-gray-500 mb-2">
                    {startDate && endDate ? 
                      `${formatDateFromObject(startDate)} to ${formatDateFromObject(endDate)} · ${calculateStayDuration()}` : 
                      'Select dates'}
                  </div> */}
                  <div className="text-sm  bg-gray-200 px-4 py-1 border-2 border-navy-700    text-center font-bold ">
                    {startDate && endDate ? 
                      `${formatDateFromObject(startDate)} to ${formatDateFromObject(endDate)} ` : 
                      'Select dates'}
                  </div>
                  <div className="text-sm w-full max-w-2xl bg-gray-200 px-4 py-1 border-2 border-navy-700   mt-10 text-center font-bold ">
                    {rooms} room · {adults} {adults === 1 ? 'adult' : 'adults'} · {seniors} {seniors === 1 ? 'senior' : 'seniors'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Check Availability Button */}
        <div className="mt-6">
          <button 
            className="w-full bg-navy-700 text-white font-bold py-3 px-6 rounded"
            onClick={() => {
              setShowCalendar(false);
              setShowGuestOptions(false);
            }}
          >
            Check Availability
          </button>
        </div>
      </div>
  );
};

export default AvailabilitySearch; 