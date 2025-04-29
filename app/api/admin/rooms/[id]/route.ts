import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                bookings: {
                    select: {
                        id: true,
                        checkIn: true,
                        checkOut: true,
                        status: true,
                        guestName: true,
                        guestEmail: true,
                        totalPrice: true,
                        createdAt: true
                    }
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        },
                        createdAt: true
                    }
                }
            }
        });

        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Calculate additional statistics
        const averageRating = room.reviews.length > 0
            ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
            : null;

        // Format the response
        const formattedRoom = {
            ...room,
            averageRating,
            totalBookings: room.bookings.length,
            currentStatus: room.available ? 'Available' : 'Unavailable',
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString()
        };

        return NextResponse.json(formattedRoom);
    } catch (error) {
        console.error('Error fetching room:', error);
        return NextResponse.json(
            { error: 'Failed to fetch room details' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const data = await request.json();

        // Check if room exists
        const existingRoom = await prisma.room.findUnique({
            where: { id }
        });

        if (!existingRoom) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Update room
        const updatedRoom = await prisma.room.update({
            where: { id },
            data: {
                name: data.name !== undefined ? data.name : undefined,
                description: data.description !== undefined ? data.description : undefined,
                price: data.price !== undefined ? parseFloat(data.price) : undefined,
                capacity: data.capacity !== undefined ? parseInt(data.capacity) : undefined,
                amenities: data.amenities !== undefined ? data.amenities : undefined,
                images: data.images !== undefined ? data.images : undefined,
                available: data.available !== undefined ? data.available : undefined
            }
        });

        return NextResponse.json(updatedRoom);
    } catch (error) {
        console.error('Error updating room:', error);
        return NextResponse.json(
            { error: 'Failed to update room' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Check if room exists
        const existingRoom = await prisma.room.findUnique({
            where: { id },
            include: {
                bookings: {
                    where: {
                        OR: [
                            { status: 'confirmed' },
                            { status: 'pending' }
                        ]
                    }
                }
            }
        });

        if (!existingRoom) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 });
        }

        // Check if room has active bookings
        if (existingRoom.bookings.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete room with active bookings' },
                { status: 400 }
            );
        }

        // Delete room
        await prisma.room.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json(
            { error: 'Failed to delete room' },
            { status: 500 }
        );
    }
}
