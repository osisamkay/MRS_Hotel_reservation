// app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, type AuthSession } from '@/src/lib/auth';
import { prisma } from '@/src/lib/prisma';
import { Booking } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const { bookingId, amount, paymentMethod, guestEmail } = await req.json();

        // Validate booking exists
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                OR: [
                    // For authenticated users
                    ...(session?.user ? [{
                        userId: session.user.id,
                        status: 'pending'
                    }] : []),
                    // For guest users
                    {
                        guestEmail: guestEmail,
                        userId: null,
                        status: 'pending'
                    }
                ]
            }
        });

        if (!booking) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid booking' }),
                { status: 400 }
            );
        }

        // In a real application, you would integrate with a payment processor here
        // For example: Stripe, PayPal, etc.
        // This is a mock implementation
        const paymentSuccess = true;

        if (paymentSuccess) {
            // Create payment record
            const payment = await prisma.payment.create({
                data: {
                    bookingId,
                    amount,
                    status: 'completed',
                    method: paymentMethod
                }
            });

            // Update booking status
            await prisma.booking.update({
                where: { id: bookingId },
                data: { status: 'confirmed' }
            });

            return NextResponse.json(payment);
        } else {
            return new NextResponse(
                JSON.stringify({ message: 'Payment failed' }),
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        return new NextResponse(
            JSON.stringify({ message: 'An error occurred while processing the payment' }),
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
                JSON.stringify({ message: 'You must be logged in to view payments' }),
                { status: 401 }
            );
        }

        // Get URL parameters
        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('id');
        const bookingId = searchParams.get('bookingId');

        // If a specific payment ID is provided
        if (paymentId) {
            const payment = await prisma.payment.findUnique({
                where: { id: paymentId },
                include: {
                    booking: {
                        include: {
                            room: true
                        }
                    }
                }
            });

            // Check if payment exists
            if (!payment) {
                return new NextResponse(
                    JSON.stringify({ message: 'Payment not found' }),
                    { status: 404 }
                );
            }

            // Ensure user has permission to view this payment
            if (payment.booking.userId !== session.user.id && session.user.role !== 'admin') {
                return new NextResponse(
                    JSON.stringify({ message: 'You do not have permission to view this payment' }),
                    { status: 403 }
                );
            }

            return NextResponse.json(payment);
        }

        // If a booking ID is provided, get the payment for that booking
        if (bookingId) {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId }
            }) as Booking | null;

            // Check if booking exists
            if (!booking) {
                return new NextResponse(
                    JSON.stringify({ message: 'Booking not found' }),
                    { status: 404 }
                );
            }

            // Ensure user has permission to view this booking's payment
            if (booking.userId !== session.user.id && session.user.role !== 'admin') {
                return new NextResponse(
                    JSON.stringify({ message: 'You do not have permission to view this booking\'s payment' }),
                    { status: 403 }
                );
            }

            const payment = await prisma.payment.findUnique({
                where: { bookingId }
            });

            return NextResponse.json(payment || { message: 'No payment found for this booking' });
        }

        // If the user is an admin, return all payments
        if (session.user.role === 'admin') {
            const payments = await prisma.payment.findMany({
                include: {
                    booking: {
                        include: {
                            room: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return NextResponse.json(payments);
        }

        // For regular users, return only their payments
        const userBookings = await prisma.booking.findMany({
            where: { userId: session.user.id },
            select: { id: true }
        });

        const bookingIds = userBookings.map((booking: { id: string }) => booking.id);

        const payments = await prisma.payment.findMany({
            where: {
                bookingId: {
                    in: bookingIds
                }
            },
            include: {
                booking: {
                    include: {
                        room: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        return new NextResponse(
            JSON.stringify({ message: 'An error occurred while fetching payments' }),
            { status: 500 }
        );
    }
}