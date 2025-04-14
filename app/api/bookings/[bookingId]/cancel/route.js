import { NextResponse } from 'next/server';
import { storageService } from '@/src/services/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { bookingId } = params;

    // Get the booking
    const booking = await storageService.getBooking(bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if the booking belongs to the user
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if the booking can be cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(booking.checkIn);
    const today = new Date();
    const hoursUntilCheckIn = (checkInDate - today) / (1000 * 60 * 60);

    // Check if cancellation is within allowed time (e.g., 24 hours before check-in)
    if (hoursUntilCheckIn < 24) {
      return NextResponse.json(
        { error: 'Bookings can only be cancelled at least 24 hours before check-in' },
        { status: 400 }
      );
    }

    // Cancel the booking
    const cancelledBooking = await storageService.cancelBooking(bookingId);

    return NextResponse.json({
      message: 'Booking cancelled successfully',
      booking: cancelledBooking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
} 