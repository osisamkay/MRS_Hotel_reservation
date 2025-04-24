import React, { useState } from 'react';
import AvailabilityCalendar from './AvailabilityCalendar';

export default function BookingForm({ onSubmit, initialData, roomId }) {
    const [formData, setFormData] = useState({
        checkIn: initialData?.checkIn ? new Date(initialData.checkIn) : null,
        checkOut: initialData?.checkOut ? new Date(initialData.checkOut) : null,
        guests: initialData?.guests || 1,
        ...initialData
    });

    const [error, setError] = useState('');

    const handleDateSelect = (checkIn, checkOut) => {
        setFormData(prev => ({
            ...prev,
            checkIn,
            checkOut
        }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate dates
        if (!formData.checkIn || !formData.checkOut) {
            setError('Please select both check-in and check-out dates');
            return;
        }

        // Validate guests
        if (formData.guests < 1) {
            setError('Number of guests must be at least 1');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Dates</label>
                <AvailabilityCalendar
                    roomId={roomId}
                    onDateSelect={handleDateSelect}
                    initialStartDate={formData.checkIn}
                    initialEndDate={formData.checkOut}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
                <input
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Check Availability
            </button>
        </form>
    );
} 