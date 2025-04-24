// app/api/rooms/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter query parameters
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined;
    const minCapacity = searchParams.get('minCapacity') ? parseInt(searchParams.get('minCapacity')) : undefined;
    const available = searchParams.get('available') === 'true' ? true : 
                     searchParams.get('available') === 'false' ? false : undefined;
    
    // Build the where clause for filtering
    const where = {};
    
    if (minPrice !== undefined) {
      where.price = {
        ...(where.price || {}),
        gte: minPrice
      };
    }
    
    if (maxPrice !== undefined) {
      where.price = {
        ...(where.price || {}),
        lte: maxPrice
      };
    }
    
    if (minCapacity !== undefined) {
      where.capacity = {
        gte: minCapacity
      };
    }
    
    if (available !== undefined) {
      where.available = available;
    }
    
    console.log('Fetching rooms with filters:', where);
    
    // Get rooms from database
    const rooms = await prisma.room.findMany({
      where,
      orderBy: {
        price: 'asc'
      }
    });
    
    console.log(`Retrieved ${rooms.length} rooms`);
    
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }
    
    const roomData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'capacity', 'amenities', 'images'];
    const missingFields = requiredFields.filter(field => !roomData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create room in database
    const newRoom = await prisma.room.create({
      data: roomData
    });
    
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create room' },
      { status: 500 }
    );
  }
}