import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';

// Helper function to safely convert BigInt to number
function convertBigIntToNumber(value: any): any {
    if (typeof value === 'bigint') {
        return Number(value);
    }
    if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
            return value.map(convertBigIntToNumber);
        }
        const converted: any = {};
        for (const key in value) {
            converted[key] = convertBigIntToNumber(value[key]);
        }
        return converted;
    }
    return value;
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current date
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Start of current month
        const startOfMonth = new Date(currentYear, currentMonth, 1);

        // Start of previous month
        const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1);

        // End of previous month
        const endOfPrevMonth = new Date(currentYear, currentMonth, 0);

        // Fetch all statistics in parallel
        const [
            totalUsers,
            totalRooms,
            totalBookings,
            totalRevenue,
            averageRating,
            recentBookings,
            recentReviews,
            bookingsByStatus,
            currentMonthBookings,
            previousMonthBookings,
            roomOccupancy,
            topRooms
        ] = await Promise.all([
            // Total users count
            prisma.user.count(),

            // Total rooms count
            prisma.room.count(),

            // Total bookings count
            prisma.booking.count(),

            // Total revenue
            prisma.booking.aggregate({
                where: {
                    status: 'confirmed'
                },
                _sum: {
                    totalPrice: true
                }
            }),

            // Average rating
            prisma.review.aggregate({
                _avg: {
                    rating: true
                }
            }),

            // Recent bookings
            prisma.booking.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    room: {
                        select: {
                            name: true,
                            description: true
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
            }),

            // Recent reviews
            prisma.review.findMany({
                take: 5,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    room: {
                        select: {
                            name: true
                        }
                    }
                }
            }),

            // Bookings by status
            prisma.$queryRaw`
                SELECT status, COUNT(*)::integer as count
                FROM "Booking"
                GROUP BY status
            `,

            // Current month bookings
            prisma.booking.count({
                where: {
                    createdAt: {
                        gte: startOfMonth
                    }
                }
            }),

            // Previous month bookings
            prisma.booking.count({
                where: {
                    createdAt: {
                        gte: startOfPrevMonth,
                        lt: endOfPrevMonth
                    }
                }
            }),

            // Room occupancy (rooms with active bookings)
            prisma.room.count({
                where: {
                    bookings: {
                        some: {
                            checkIn: {
                                lte: now
                            },
                            checkOut: {
                                gte: now
                            },
                            status: 'confirmed'
                        }
                    }
                }
            }),

            // Top booked rooms
            prisma.room.findMany({
                take: 5,
                select: {
                    id: true,
                    name: true,
                    price: true,
                    _count: {
                        select: {
                            bookings: true
                        }
                    }
                },
                orderBy: {
                    bookings: {
                        _count: 'desc'
                    }
                }
            })
        ]);

        // Calculate month-over-month growth
        const bookingGrowth = previousMonthBookings > 0
            ? ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100
            : 0;

        // Calculate occupancy rate
        const occupancyRate = totalRooms > 0 ? (roomOccupancy / totalRooms) * 100 : 0;

        // Format the response
        const formattedRecentBookings = recentBookings.map(booking => ({
            id: booking.id,
            guestName: booking.guestName || `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim(),
            roomName: booking.room.name,
            checkIn: booking.checkIn,
            status: booking.status
        }));

        const formattedRecentReviews = recentReviews.map(review => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            guestName: `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim(),
            roomName: review.room.name,
            createdAt: review.createdAt
        }));

        const formattedTopRooms = topRooms.map(room => ({
            id: room.id,
            name: room.name,
            price: room.price,
            bookingCount: room._count.bookings
        }));

        // Convert any BigInt values to regular numbers before sending the response
        const response = convertBigIntToNumber({
            totalUsers,
            totalRooms,
            totalBookings,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            averageRating: averageRating._avg.rating || 0,
            bookingGrowth,
            occupancyRate,
            bookingsByStatus,
            recentBookings: formattedRecentBookings,
            recentReviews: formattedRecentReviews,
            topRooms: formattedTopRooms
        });

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard statistics' },
            { status: 500 }
        );
    }
}
