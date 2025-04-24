'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const CustomDatePicker = ({
    selected,
    onChange,
    minDate,
    dateFormat = 'MMM d, yyyy',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selected || new Date());
    const datePickerRef = useRef(null);

    // Close the date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format date according to the specified format
    const formatDate = (date) => {
        if (!date) return '';

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Generate days for the current month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get day of week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Check if a date is before minDate
    const isBeforeMinDate = (date) => {
        if (!minDate) return false;

        // Reset hours to compare just the dates
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);

        const minDateTime = new Date(minDate);
        minDateTime.setHours(0, 0, 0, 0);

        return dateToCheck < minDateTime;
    };

    // Check if a date is the currently selected date
    const isSelectedDate = (date) => {
        if (!selected) return false;

        const selectedDate = new Date(selected);
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        onChange(date);
        setIsOpen(false);
    };

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Render calendar days
    const renderCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isDisabled = isBeforeMinDate(date);
            const isSelected = isSelectedDate(date);

            days.push(
                <button
                    key={`day-${day}`}
                    type="button"
                    onClick={() => !isDisabled && handleDateSelect(date)}
                    disabled={isDisabled}
                    className={`
            h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isSelected ? 'bg-navy-600 text-white' : 'hover:bg-gray-100'}
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
          `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div className="relative" ref={datePickerRef}>
            <div
                className={`relative cursor-pointer ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    readOnly
                    value={formatDate(selected)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-navy-600 cursor-pointer"
                />
                <Calendar className="h-5 w-5 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            &lt;
                        </button>
                        <div>
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <button
                            type="button"
                            onClick={goToNextMonth}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                            <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-gray-500">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {renderCalendarDays()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomDatePicker;
