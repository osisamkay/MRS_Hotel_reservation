import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get('roomId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const monthYear = searchParams.get('monthYear'); // Format: YYYY-MM

        if (!roomId) {
            return new NextResponse(
                JSON.stringify({ message: 'Room ID is required' }),
                { status: 400 }
            );
        }

        // If checking specific dates
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const existingBookings = await prisma.booking.findMany({
                where: {
                    roomId,
                    status: {
                        notIn: ['cancelled']
                    },
                    AND: [
                        {
                            checkIn: {
                                lt: end
                            }
                        },
                        {
                            checkOut: {
                                gt: start
                            }
                        }
                    ]
                },
                select: {
                    checkIn: true,
                    checkOut: true
                }
            });

            return NextResponse.json({
                available: existingBookings.length === 0,
                conflictingBookings: existingBookings
            });
        }

        // If checking availability for a whole month
        if (monthYear) {
            const [year, month] = monthYear.split('-').map(Number);
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0);

            const bookings = await prisma.booking.findMany({
                where: {
                    roomId,
                    status: {
                        notIn: ['cancelled']
                    },
                    AND: [
                        {
                            checkIn: {
                                lte: endOfMonth
                            }
                        },
                        {
                            checkOut: {
                                gte: startOfMonth
                            }
                        }
                    ]
                },
                select: {
                    checkIn: true,
                    checkOut: true
                }
            });

            // Create an array of all days in the month
            const daysInMonth = endOfMonth.getDate();
            const availability = Array.from({ length: daysInMonth }, (_, i) => {
                const date = new Date(year, month - 1, i + 1);
                const isBooked = bookings.some(booking => {
                    const checkIn = new Date(booking.checkIn);
                    const checkOut = new Date(booking.checkOut);
                    return date >= checkIn && date < checkOut;
                });

                return {
                    date: date.toISOString(),
                    available: !isBooked
                };
            });

            return NextResponse.json({ availability });
        }

        return new NextResponse(
            JSON.stringify({ message: 'Either date range or month-year is required' }),
            { status: 400 }
        );

    } catch (error) {
        console.error('Error checking availability:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Error checking availability' }),
            { status: 500 }
        );
    }
} 