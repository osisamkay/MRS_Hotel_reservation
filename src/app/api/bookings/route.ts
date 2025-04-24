// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions, type AuthSession } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { validateBookingDates, calculateTotalPrice } from '@/src/utils/bookingUtils';

export async function POST(req: NextRequest) {
    try {
        // Parse request body first
        const body = await req.json();
        const {
            roomId,
            checkIn,
            checkOut,
            guests,
            specialRequests,
            email,
            firstName,
            lastName,
            phone,
            totalPrice
        } = body;

        console.log('Booking request body:', body);

        // Get the authenticated user session (optional)
        const session = await getServerSession(authOptions) as AuthSession | null;
        const isGuestBooking = !session?.user?.id;

        // Validate input
        if (!roomId || !checkIn || !checkOut || !guests) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Missing required fields',
                    details: { roomId, checkIn, checkOut, guests }
                }),
                { status: 400 }
            );
        }

        // For guest bookings, validate guest information
        if (isGuestBooking) {
            if (!email || !firstName || !lastName || !phone) {
                return new NextResponse(
                    JSON.stringify({
                        message: 'Guest information is required for non-authenticated bookings',
                        details: { email, firstName, lastName, phone }
                    }),
                    { status: 400 }
                );
            }
        }

        // Parse and validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Ensure dates are valid
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Invalid date format',
                    details: { checkIn, checkOut }
                }),
                { status: 400 }
            );
        }

        // Ensure check-out is after check-in
        if (checkInDate >= checkOutDate) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Check-out date must be after check-in date',
                    details: { checkIn: checkInDate, checkOut: checkOutDate }
                }),
                { status: 400 }
            );
        }

        // Get room details
        const room = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!room) {
            return new NextResponse(
                JSON.stringify({ message: 'Room not found', details: { roomId } }),
                { status: 404 }
            );
        }

        // Check room availability
        const existingBookings = await prisma.booking.findMany({
            where: {
                roomId,
                status: {
                    notIn: ['cancelled']
                },
                AND: [
                    {
                        checkIn: {
                            lt: checkOutDate
                        }
                    },
                    {
                        checkOut: {
                            gt: checkInDate
                        }
                    }
                ]
            }
        });

        console.log('Existing bookings for room:', existingBookings);

        if (existingBookings.length > 0) {
            return new NextResponse(
                JSON.stringify({
                    message: 'Room is not available for the selected dates',
                    details: {
                        requestedDates: { checkIn: checkInDate, checkOut: checkOutDate },
                        conflictingBookings: existingBookings.map(b => ({
                            checkIn: b.checkIn,
                            checkOut: b.checkOut
                        }))
                    }
                }),
                { status: 409 }
            );
        }

        // Create booking
        const bookingData = {
            roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            totalPrice,
            status: 'pending',
            specialRequests: specialRequests || '',
            ...(isGuestBooking
                ? {
                    guestEmail: email,
                    guestName: `${firstName} ${lastName}`.trim(),
                    guestPhone: phone
                }
                : { userId: session.user.id }
            )
        };

        console.log('Creating booking with data:', bookingData);

        const booking = await prisma.booking.create({
            data: bookingData
        });

        // Return created booking
        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error creating booking:', error);
        return new NextResponse(
            JSON.stringify({
                message: 'An error occurred while creating the booking',
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        // Get the authenticated user session
        const session = await getServerSession(authOptions) as AuthSession | null;

        if (!session?.user?.id) {
            return new NextResponse(
                JSON.stringify({ message: 'You must be logged in to view bookings' }),
                { status: 401 }
            );
        }

        // Get URL parameters
        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get('id');

        // If a specific booking ID is provided
        if (bookingId) {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: {
                    room: true,
                    payment: true
                }
            });

            // Check if booking exists and if user has permission to view it
            if (!booking) {
                return new NextResponse(
                    JSON.stringify({ message: 'Booking not found' }),
                    { status: 404 }
                );
            }

            // Ensure user has permission to view this booking
            if (booking.userId !== session.user.id && session.user.role !== 'admin') {
                return new NextResponse(
                    JSON.stringify({ message: 'You do not have permission to view this booking' }),
                    { status: 403 }
                );
            }

            return NextResponse.json(booking);
        }

        // Otherwise, get all bookings for the user
        const bookings = await prisma.booking.findMany({
            where: {
                // For admin users, return all bookings. For regular users, return only their bookings
                ...(session.user.role !== 'admin' ? { userId: session.user.id } : {}),
            },
            include: {
                room: true,
                payment: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return new NextResponse(
            JSON.stringify({ message: 'An error occurred while fetching bookings' }),
            { status: 500 }
        );
    }
}