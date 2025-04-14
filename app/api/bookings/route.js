import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { dataService } from '@/src/services/dataService';

/**
 * Get bookings with optional filtering
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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
      
      bookings = await dataService.getBookingsByUser(userId);
    } else {
      // Only staff and admins can view all bookings
      if (!['admin', 'staff', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Unauthorized to view all bookings' },
          { status: 403 }
        );
      }
      
      bookings = await dataService.getAllBookings();
      
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
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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

    // Check room availability
    const { available } = await dataService.getRoomAvailability(
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.roomId
    );

    if (!available) {
      return NextResponse.json(
        { error: 'Room is not available for the selected dates' },
        { status: 400 }
      );
    }

    // Add user ID from session
    const newBookingData = {
      ...bookingData,
      userId: session.user.id,
      status: 'pending',
      paymentStatus: 'pending'
    };

    const newBooking = await dataService.createBooking(newBookingData);
    
    return NextResponse.json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}