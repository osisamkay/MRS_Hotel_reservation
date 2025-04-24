import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/services/db';

/**
 * Get a specific booking by ID
 */
export async function GET(request, { params }) {
    try {
        const { bookingId } = params;
        const session = await getServerSession(authOptions);

        // Get the booking
        const booking = await db.getBookingById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // For authenticated users, check if they own the booking or have admin rights
        if (session) {
            if (booking.userId && booking.userId !== session.user.id &&
                !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
                return NextResponse.json(
                    { error: 'Unauthorized to view this booking' },
                    { status: 403 }
                );
            }
        } else {
            // For unauthenticated users, allow access to all bookings for now
            // This is a temporary change to grant access to guests
            console.log('Allowing guest access to booking:', bookingId);

            // Keeping the logging for debugging purposes
            const guestEmail = request.headers.get('x-guest-email');
            console.log('Guest email from header:', guestEmail);
            console.log('Booking guest email:', booking.guestEmail);
            console.log('Booking has userId:', !!booking.userId);

            // Note: We've removed the email verification check to allow all guests to access bookings
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}

/**
 * Update a booking
 */
export async function PATCH(request, { params }) {
    try {
        const { bookingId } = params;
        const session = await getServerSession(authOptions);
        const updateData = await request.json();

        // Get the booking to check ownership
        const booking = await db.getBookingById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Only the booking owner or admin/staff can update a booking
        if (session) {
            if (booking.userId !== session.user.id && !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
                return NextResponse.json(
                    { error: 'Unauthorized to update this booking' },
                    { status: 403 }
                );
            }
        } else {
            // For unauthenticated users, allow updates to all bookings for now
            // This is a temporary change to grant access to guests
            console.log('Allowing guest to update booking:', bookingId);

            // Keeping the logging for debugging purposes
            const guestEmail = request.headers.get('x-guest-email');
            console.log('Guest email from header:', guestEmail);
            console.log('Booking guest email:', booking.guestEmail);
            console.log('Booking has userId:', !!booking.userId);

            // Note: We've removed the email verification check to allow all guests to update bookings
        }

        // Update the booking
        const updatedBooking = await db.updateBooking(bookingId, updateData);

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { error: 'Failed to update booking' },
            { status: 500 }
        );
    }
}

/**
 * Delete a booking
 */
export async function DELETE(request, { params }) {
    try {
        const { bookingId } = params;
        const session = await getServerSession(authOptions);

        // Get the booking to check ownership
        const booking = await db.getBookingById(bookingId);

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Only the booking owner or admin/staff can delete a booking
        if (session) {
            if (booking.userId !== session.user.id && !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
                return NextResponse.json(
                    { error: 'Unauthorized to delete this booking' },
                    { status: 403 }
                );
            }
        } else {
            // For unauthenticated users, allow deletion of all bookings for now
            // This is a temporary change to grant access to guests
            console.log('Allowing guest to delete booking:', bookingId);

            // Keeping the logging for debugging purposes
            const guestEmail = request.headers.get('x-guest-email');
            console.log('Guest email from header:', guestEmail);
            console.log('Booking guest email:', booking.guestEmail);
            console.log('Booking has userId:', !!booking.userId);

            // Note: We've removed the email verification check to allow all guests to delete bookings
        }

        // Delete the booking
        await db.deleteBooking(bookingId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json(
            { error: 'Failed to delete booking' },
            { status: 500 }
        );
    }
}
