import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';

// Helper function to check admin authorization
async function checkAdminAuthorization() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: 'No session found', status: 401 };
    }

    if (!['admin', 'super_admin', 'staff'].includes(session.user.role as string)) {
        return { error: 'Insufficient permissions', status: 401 };
    }

    return { session };
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await checkAdminAuthorization();
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const bookingId = params.id;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        images: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await checkAdminAuthorization();
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const bookingId = params.id;
        const data = await request.json();

        // Verify booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                room: true
            }
        });

        if (!existingBooking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData: any = {};

        // Handle status update
        if (data.status) {
            updateData.status = data.status;
        }

        // Handle date updates
        if (data.checkIn) {
            updateData.checkIn = new Date(data.checkIn);
        }
        if (data.checkOut) {
            updateData.checkOut = new Date(data.checkOut);
        }

        // Handle guest information updates
        if (data.guestName) updateData.guestName = data.guestName;
        if (data.guestEmail) updateData.guestEmail = data.guestEmail;
        if (data.guestPhone) updateData.guestPhone = data.guestPhone;

        // If dates are being updated, check for conflicts
        if (data.checkIn || data.checkOut) {
            const checkIn = data.checkIn ? new Date(data.checkIn) : existingBooking.checkIn;
            const checkOut = data.checkOut ? new Date(data.checkOut) : existingBooking.checkOut;

            // Verify the dates are valid
            if (checkIn >= checkOut) {
                return NextResponse.json(
                    { error: 'Check-in date must be before check-out date' },
                    { status: 400 }
                );
            }

            // Check for conflicts with other bookings
            const conflictingBooking = await prisma.booking.findFirst({
                where: {
                    id: { not: bookingId },
                    roomId: existingBooking.roomId,
                    status: { not: 'cancelled' },
                    OR: [
                        {
                            AND: [
                                { checkIn: { lte: checkIn } },
                                { checkOut: { gt: checkIn } }
                            ]
                        },
                        {
                            AND: [
                                { checkIn: { lt: checkOut } },
                                { checkOut: { gte: checkOut } }
                            ]
                        }
                    ]
                }
            });

            if (conflictingBooking) {
                return NextResponse.json(
                    { error: 'The selected dates conflict with another booking' },
                    { status: 400 }
                );
            }
        }

        // Update booking
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: updateData,
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        images: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { error: 'Failed to update booking' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await checkAdminAuthorization();
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const bookingId = params.id;

        // Verify booking exists
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Delete booking
        await prisma.booking.delete({
            where: { id: bookingId }
        });

        return NextResponse.json(
            { message: 'Booking deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json(
            { error: 'Failed to delete booking' },
            { status: 500 }
        );
    }
} 