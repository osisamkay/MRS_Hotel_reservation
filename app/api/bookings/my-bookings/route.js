import { NextResponse } from 'next/server';
import { storageService } from '@/src/services/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's bookings
    const bookings = await storageService.getBookingsByUser(session.user.id);

    // Get room details for each booking
    const bookingsWithRooms = await Promise.all(
      bookings.map(async (booking) => {
        const room = await storageService.getRoom(booking.roomId);
        return {
          ...booking,
          room
        };
      })
    );

    // Sort bookings by date (most recent first)
    bookingsWithRooms.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json({
      bookings: bookingsWithRooms
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
} 