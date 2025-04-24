// app/api/rooms/available/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get date parameters
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = parseInt(searchParams.get('guests') || '1');
    const rooms = parseInt(searchParams.get('rooms') || '1');
    
    console.log('Searching for available rooms:', { checkIn, checkOut, guests, rooms });
    
    // Validate inputs
    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Check-in and check-out dates are required' },
        { status: 400 }
      );
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }
    
    // Find rooms that are not booked during the requested period
    const bookedRooms = await prisma.booking.findMany({
      where: {
        OR: [
          {
            checkIn: {
              lt: checkOutDate,
            },
            checkOut: {
              gt: checkInDate,
            },
          },
        ],
        status: {
          notIn: ['cancelled'],
        },
      },
      select: {
        roomId: true,
      },
    });
    
    // Get unique booked room IDs
    const bookedRoomIds = [...new Set(bookedRooms.map((booking) => booking.roomId))];
    
    console.log(`Found ${bookedRoomIds.length} booked rooms for the period`);
    
    // Find available rooms with sufficient capacity
    const availableRooms = await prisma.room.findMany({
      where: {
        id: {
          notIn: bookedRoomIds,
        },
        capacity: {
          gte: guests,
        },
        available: true,
      },
    });
    
    console.log(`Found ${availableRooms.length} available rooms`);
    
    return NextResponse.json(availableRooms);
  } catch (error) {
    console.error('Error searching for available rooms:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search for available rooms' },
      { status: 500 }
    );
  }
}