'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Search } from 'lucide-react';

export default function AvailabilityChecker() {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);

    const handleSearch = () => {
        if (!checkIn || !checkOut) {
            alert('Please select check-in and check-out dates');
            return;
        }

        const searchParams = new URLSearchParams({
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            guests: guests,
            rooms: rooms
        });

        router.push(`/search-rooms?${searchParams.toString()}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto -mt-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Check-in Date */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date
                    </label>
                    <div className="relative">
                        <DatePicker
                            selected={checkIn}
                            onChange={date => setCheckIn(date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={new Date()}
                            placeholderText="Select check-in date"
                            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>

                {/* Check-out Date */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date
                    </label>
                    <div className="relative">
                        <DatePicker
                            selected={checkOut}
                            onChange={date => setCheckOut(date)}
                            selectsEnd
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={checkIn || new Date()}
                            placeholderText="Select check-out date"
                            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                </div>

                {/* Guests and Rooms */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests & Rooms
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            className="w-full px-4 py-2 border rounded-md text-left flex items-center justify-between"
                            onClick={() => document.getElementById('guestsDropdown').classList.toggle('hidden')}
                        >
                            <span>{guests} Guest(s), {rooms} Room(s)</span>
                            <Users className="h-5 w-5 text-gray-400" />
                        </button>
                        <div
                            id="guestsDropdown"
                            className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg hidden z-10"
                        >
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Guests</span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-8 h-8 border rounded-full flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span>{guests}</span>
                                        <button
                                            onClick={() => setGuests(Math.min(10, guests + 1))}
                                            className="w-8 h-8 border rounded-full flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Rooms</span>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                                            className="w-8 h-8 border rounded-full flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span>{rooms}</span>
                                        <button
                                            onClick={() => setRooms(Math.min(5, rooms + 1))}
                                            className="w-8 h-8 border rounded-full flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-mrs-blue text-white px-6 py-2 rounded-md hover:bg-navy-800 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Search className="h-5 w-5" />
                        <span>Check Availability</span>
                    </button>
                </div>
            </div>
        </div>
    );
} 