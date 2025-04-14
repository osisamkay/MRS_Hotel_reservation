import { NextResponse } from 'next/server';
import { storageService } from '@/src/services/storage';
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
    const requiredFields = ['name', 'type', 'price', 'capacity', 'bedType', 'description'];
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

    const updatedRoom = await storageService.updateRoom(roomId, updateData);
    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update room' },
      { status: error.message === 'Room not found' ? 404 : 500 }
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
    await storageService.deleteRoom(roomId);

    return NextResponse.json({
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete room' },
      { 
        status: error.message === 'Room not found' ? 404 :
                error.message === 'Cannot delete room with active bookings' ? 400 : 500
      }
    );
  }
} 