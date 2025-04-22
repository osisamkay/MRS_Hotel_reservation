import { NextResponse } from 'next/server';
import { dataService } from '@/src/services/dataService';

/**
 * Get available rooms based on search criteria
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = parseInt(searchParams.get('guests') || '1', 10);
    const rooms = parseInt(searchParams.get('rooms') || '1', 10);

    // Validate parameters
    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Check-in and check-out dates are required' },
        { status: 400 }
      );
    }

    // Format parameters
    const formattedCheckIn = new Date(checkIn).toISOString();
    const formattedCheckOut = new Date(checkOut).toISOString();

    // Get available rooms
    const availableRooms = await dataService.getRoomAvailability(
      formattedCheckIn,
      formattedCheckOut
    );

    // Filter rooms based on capacity
    const filteredRooms = availableRooms.filter(room => room.capacity >= guests);

    return NextResponse.json({
      rooms: filteredRooms,
      searchParams: {
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        guests,
        rooms
      }
    });
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available rooms' },
      { status: 500 }
    );
  }
}