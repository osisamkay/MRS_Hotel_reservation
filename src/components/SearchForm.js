'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export function SearchForm() {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState({
        checkIn: new Date(),
        checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
        guests: 1,
        roomType: 'any'
    });

    const handleDateChange = (dates) => {
        const [checkIn, checkOut] = dates;
        setSearchParams(prev => ({
            ...prev,
            checkIn,
            checkOut
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format dates for URL
        const checkInStr = searchParams.checkIn.toISOString().split('T')[0];
        const checkOutStr = searchParams.checkOut.toISOString().split('T')[0];

        // Build search URL
        const searchUrl = `/search-rooms?` + new URLSearchParams({
            checkIn: checkInStr,
            checkOut: checkOutStr,
            guests: searchParams.guests,
            roomType: searchParams.roomType
        }).toString();

        router.push(searchUrl);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Check-in / Check-out
                    </label>
                    <DatePicker
                        selected={searchParams.checkIn}
                        onChange={handleDateChange}
                        startDate={searchParams.checkIn}
                        endDate={searchParams.checkOut}
                        selectsRange
                        minDate={new Date()}
                        className="w-full p-2 border rounded"
                        dateFormat="MMM d, yyyy"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Guests
                    </label>
                    <select
                        value={searchParams.guests}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, guests: e.target.value }))}
                        className="w-full p-2 border rounded"
                    >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Room Type
                    </label>
                    <select
                        value={searchParams.roomType}
                        onChange={(e) => setSearchParams(prev => ({ ...prev, roomType: e.target.value }))}
                        className="w-full p-2 border rounded"
                    >
                        <option value="any">Any Type</option>
                        <option value="standard">Standard</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="suite">Suite</option>
                    </select>
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
                Search Available Rooms
            </button>
        </form>
    );
} 