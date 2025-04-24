// app/api/rooms/[roomId]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId } = params;
    const updateData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'capacity'];
    const missingFields = requiredFields.filter(field => !updateData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(updateData.price) || updateData.price <= 0) {
      return NextResponse.json(
        { error: 'Invalid price' },
        { status: 400 }
      );
    }

    if (isNaN(updateData.capacity) || updateData.capacity <= 0) {
      return NextResponse.json(
        { error: 'Invalid capacity' },
        { status: 400 }
      );
    }

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Update room
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: updateData
    });

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update room' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { roomId } = params;

    // Check if room exists
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!existingRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room has active bookings
    const activeBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          not: 'cancelled'
        },
        checkOut: {
          gt: new Date()
        }
      }
    });

    if (activeBookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete room with active bookings' },
        { status: 400 }
      );
    }

    // Delete room
    await prisma.room.delete({
      where: { id: roomId }
    });

    return NextResponse.json({
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete room' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { roomId } = params;
    
    console.log('Fetching room with ID:', roomId);
    
    // Get room from database using Prisma
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });
    
    console.log('Retrieved room:', room);

    if (!room) {
      console.log('Room not found');
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch room details' },
      { status: 500 }
    );
  }
}