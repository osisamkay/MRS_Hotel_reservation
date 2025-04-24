'use client';

export default function BookingSummary({ booking, room }) {
    if (!booking || !room) return null;

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Payment for Booking #{booking.id}</h1>
            <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="font-bold mb-2">Booking Summary</h3>
                <p><span className="font-semibold">Room:</span> {room.name}</p>
                <p><span className="font-semibold">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
                <p><span className="font-semibold">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><span className="font-semibold">Guests:</span> {booking.guests}</p>
                <p className="text-lg font-bold mt-2">Total: ${booking.totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
}
