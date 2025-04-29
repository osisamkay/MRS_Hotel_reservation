import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';

export async function GET() {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all rooms with additional details for admin view
        const rooms = await prisma.room.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                bookings: {
                    select: {
                        id: true,
                        checkIn: true,
                        checkOut: true,
                        status: true
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                }
            }
        });

        // Calculate additional statistics for each room
        const enhancedRooms = rooms.map(room => {
            const totalBookings = room.bookings.length;
            const averageRating = room.reviews.length > 0
                ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
                : null;

            // Remove the raw data we used for calculations
            const { bookings, reviews, ...roomData } = room;

            return {
                ...roomData,
                totalBookings,
                averageRating,
                currentStatus: room.available ? 'Available' : 'Unavailable',
                createdAt: room.createdAt.toISOString(),
                updatedAt: room.updatedAt.toISOString()
            };
        });

        return NextResponse.json(enhancedRooms);
    } catch (error) {
        console.error('Error fetching admin rooms:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse request body
        const data = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'description', 'price', 'capacity'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Create new room
        const newRoom = await prisma.room.create({
            data: {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                capacity: parseInt(data.capacity),
                amenities: data.amenities || [],
                images: data.images || [],
                available: data.available !== undefined ? data.available : true
            }
        });

        return NextResponse.json(newRoom, { status: 201 });
    } catch (error) {
        console.error('Error creating room:', error);
        return NextResponse.json(
            { error: 'Failed to create room' },
            { status: 500 }
        );
    }
}
