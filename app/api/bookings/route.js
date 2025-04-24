import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/services/db';

/**
 * Get bookings with optional filtering
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const roomId = searchParams.get('roomId');
    const status = searchParams.get('status');

    let bookings;

    if (userId) {
      // Regular users can only view their own bookings
      if (session.user.id !== userId && !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Unauthorized to view these bookings' },
          { status: 403 }
        );
      }

      bookings = await db.getUserBookings(userId);
    } else {
      // Only staff and admins can view all bookings
      if (!['admin', 'staff', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Unauthorized to view all bookings' },
          { status: 403 }
        );
      }

      bookings = await db.getAllBookings();

      // Apply room filter if provided
      if (roomId) {
        bookings = bookings.filter(booking => booking.roomId === roomId);
      }
    }

    // Apply status filter if provided
    if (status) {
      bookings = bookings.filter(booking => booking.status === status);
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

/**
 * Create a new booking
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const bookingData = await request.json();

    // Validate required fields
    const requiredFields = ['roomId', 'checkIn', 'checkOut', 'guests', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate dates
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const now = new Date();

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (checkIn < now) {
      return NextResponse.json(
        { error: 'Check-in date cannot be in the past' },
        { status: 400 }
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Check room availability only if this is not a booking confirmation
    // If skipAvailabilityCheck is true, we bypass the availability check
    const skipAvailabilityCheck = bookingData.skipAvailabilityCheck;

    if (!skipAvailabilityCheck) {
      // Get available rooms for the selected dates
      const availableRooms = await db.getRoomAvailability(
        bookingData.checkIn,
        bookingData.checkOut
      );

      // Check if the requested room is in the list of available rooms
      const isRoomAvailable = availableRooms.some(room => room.id === bookingData.roomId);

      if (!isRoomAvailable) {
        return NextResponse.json(
          { error: 'Room is not available for the selected dates' },
          { status: 400 }
        );
      }
    }

    // Create booking data - remove fields that are not in the schema
    const {
      skipAvailabilityCheck: _skip,
      // specialRequests: _specialRequests,
      ...bookingDataWithoutExtraFields
    } = bookingData;

    // Create booking data - only include fields that are in the schema
    let newBookingData = {
      ...bookingDataWithoutExtraFields,
      status: 'pending'
      // Note: paymentStatus and specialRequests are not in the schema
    };

    // Add user ID from session if authenticated
    if (session && session.user) {
      newBookingData.userId = session.user.id;

      // If authenticated user, use their profile info if guest info not provided
      if (!bookingData.guestName) {
        newBookingData.guestName = `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || session.user.name || 'Guest';
      }

      if (!bookingData.guestEmail) {
        newBookingData.guestEmail = session.user.email;
      }

      if (!bookingData.guestPhone && session.user.phone) {
        newBookingData.guestPhone = session.user.phone;
      }
    }

    // For all bookings (authenticated or not), ensure we have guest information
    if (!newBookingData.guestName || !newBookingData.guestEmail || !bookingData.guestPhone) {
      return NextResponse.json(
        { error: 'Guest information (name, email, and phone) is required for all bookings' },
        { status: 400 }
      );
    }

    const newBooking = await db.createBooking(newBookingData);

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
