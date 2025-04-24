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
            // For unauthenticated users, only allow access to guest bookings (no userId)
            // or if they have the correct guest email
            const guestEmail = request.headers.get('x-guest-email');
            console.log('Guest email from header:', guestEmail);
            console.log('Booking guest email:', booking.guestEmail);
            console.log('Booking has userId:', !!booking.userId);

            if (booking.userId) {
                console.log('Access denied: Booking belongs to a registered user');
                return NextResponse.json(
                    { error: 'Unauthorized to view this booking - belongs to a registered user' },
                    { status: 403 }
                );
            }

            if (booking.guestEmail && booking.guestEmail !== guestEmail) {
                console.log('Access denied: Guest email mismatch');
                return NextResponse.json(
                    { error: 'Unauthorized to view this booking - guest email mismatch' },
                    { status: 403 }
                );
            }
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
            // For unauthenticated users, only allow updates to guest bookings (no userId)
            // and only if they have the correct guest email
            const guestEmail = request.headers.get('x-guest-email');
            if (booking.userId || (booking.guestEmail && booking.guestEmail !== guestEmail)) {
                return NextResponse.json(
                    { error: 'Unauthorized to update this booking' },
                    { status: 403 }
                );
            }
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
            // For unauthenticated users, only allow deletion of guest bookings (no userId)
            // and only if they have the correct guest email
            const guestEmail = request.headers.get('x-guest-email');
            if (booking.userId || (booking.guestEmail && booking.guestEmail !== guestEmail)) {
                return NextResponse.json(
                    { error: 'Unauthorized to delete this booking' },
                    { status: 403 }
                );
            }
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
