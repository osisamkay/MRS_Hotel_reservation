import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bookings = await prisma.booking.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                userId: true,
                roomId: true,
                checkIn: true,
                checkOut: true,
                guests: true,
                totalPrice: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                guestEmail: true,
                guestName: true,
                guestPhone: true,
                specialRequests: true,
                room: {
                    select: {
                        name: true,
                        description: true,
                        price: true
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
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

        const data = await request.json();

        // Validate required fields
        const requiredFields = ['roomId', 'checkIn', 'checkOut', 'guests', 'totalPrice', 'guestEmail', 'guestName'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                userId: data.userId || null,
                roomId: data.roomId,
                checkIn: new Date(data.checkIn),
                checkOut: new Date(data.checkOut),
                guests: data.guests,
                totalPrice: data.totalPrice,
                status: data.status || 'pending',
                guestEmail: data.guestEmail,
                guestName: data.guestName,
                guestPhone: data.guestPhone || null,
                specialRequests: data.specialRequests || ''
            },
            select: {
                id: true,
                userId: true,
                roomId: true,
                checkIn: true,
                checkOut: true,
                guests: true,
                totalPrice: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                guestEmail: true,
                guestName: true,
                guestPhone: true,
                specialRequests: true,
                room: {
                    select: {
                        name: true,
                        description: true,
                        price: true
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
} 