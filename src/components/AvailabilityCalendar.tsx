import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface AvailabilityCalendarProps {
    roomId: string;
    onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
    initialStartDate?: Date;
    initialEndDate?: Date;
}

interface DayAvailability {
    date: string;
    available: boolean;
}

export default function AvailabilityCalendar({
    roomId,
    onDateSelect,
    initialStartDate,
    initialEndDate
}: AvailabilityCalendarProps) {
    const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);
    const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch availability data when month changes
    const fetchMonthAvailability = async (date: Date) => {
        try {
            setLoading(true);
            setError('');
            
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const response = await fetch(`/api/rooms/availability?roomId=${roomId}&monthYear=${monthYear}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch availability');
            }

            const data = await response.json();
            setAvailabilityData(data.availability);
        } catch (err) {
            setError('Error loading availability data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Check specific date range availability
    const checkDateRangeAvailability = async (start: Date, end: Date) => {
        try {
            const response = await fetch(
                `/api/rooms/availability?roomId=${roomId}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to check availability');
            }

            const data = await response.json();
            return data.available;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // Handle month change
    const handleMonthChange = (date: Date) => {
        fetchMonthAvailability(date);
    };

    // Handle date selection
    const handleDateChange = async (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        
        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            const isAvailable = await checkDateRangeAvailability(start, end);
            if (!isAvailable) {
                setError('Selected dates are not available');
                return;
            }
            setError('');
        }

        if (onDateSelect) {
            onDateSelect(start, end);
        }
    };

    // Initialize calendar
    useEffect(() => {
        if (initialStartDate) {
            fetchMonthAvailability(initialStartDate);
        } else {
            fetchMonthAvailability(new Date());
        }
    }, [roomId]);

    // Custom day rendering
    const renderDayContents = (day: number, date: Date) => {
        const dateStr = date.toISOString();
        const dayData = availabilityData.find(d => d.date.startsWith(dateStr.split('T')[0]));
        
        return (
            <div className={`
                w-full h-full flex items-center justify-center
                ${dayData?.available === false ? 'bg-red-100 text-red-800' : ''}
                ${startDate && endDate && date >= startDate && date <= endDate ? 'bg-navy-100' : ''}
            `}>
                {day}
            </div>
        );
    };

    return (
        <div className="w-full">
            {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
                    {error}
                </div>
            )}
            
            {loading && (
                <div className="text-gray-600 mb-4">
                    Loading availability...
                </div>
            )}

            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                minDate={new Date()}
                monthsShown={2}
                onMonthChange={handleMonthChange}
                renderDayContents={renderDayContents}
                className="w-full"
                calendarClassName="w-full"
            />

            {startDate && endDate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="font-medium">Selected Dates:</p>
                    <p>Check-in: {startDate.toLocaleDateString()}</p>
                    <p>Check-out: {endDate.toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
} 