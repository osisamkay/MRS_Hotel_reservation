import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { dataService } from '@/src/services/dataService';

/**
 * Get recent bookings for dashboard
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

    // Only admin and staff can access recent bookings list
    if (!['admin', 'staff', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to access recent bookings' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    const bookings = await dataService.getRecentBookings(limit);
    
    // For each booking, get the user name
    const bookingsWithUserData = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const user = await dataService.getUserById(booking.userId);
          return {
            ...booking,
            guestName: user ? user.name : 'Unknown'
          };
        } catch (error) {
          return booking;
        }
      })
    );
    
    return NextResponse.json({ bookings: bookingsWithUserData });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent bookings' },
      { status: 500 }
    );
  }
}