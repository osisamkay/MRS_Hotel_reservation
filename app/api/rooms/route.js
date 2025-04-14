import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isUserAdmin } from '@/src/lib/auth';
import { dataService } from '@/src/services/dataService';

/**
 * Get rooms with optional filtering
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const capacity = searchParams.get('capacity');
    
    let rooms = await dataService.getAllRooms();
    
    // Filter by availability if dates are provided
    if (checkIn && checkOut) {
      const availableRooms = await dataService.getRoomAvailability(checkIn, checkOut);
      if (availableRooms.length > 0) {
        rooms = availableRooms;
      }
    }
    
    // Filter by capacity if provided
    if (capacity) {
      const minCapacity = parseInt(capacity, 10);
      if (!isNaN(minCapacity)) {
        rooms = rooms.filter(room => room.capacity >= minCapacity);
      }
    }
    
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

/**
 * Create a new room (admin only)
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !isUserAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const roomData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'price', 'capacity', 'bedType'];
    const missingFields = requiredFields.filter(field => !roomData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    const newRoom = await dataService.createRoom(roomData);
    
    return NextResponse.json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    );
  }
}