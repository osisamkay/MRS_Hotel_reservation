import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = parseInt(searchParams.get('guests') || '1', 10);
        const roomCount = parseInt(searchParams.get('rooms') || '1', 10);

        console.log('API Request params:', { checkIn, checkOut, guests, roomCount });

        if (!checkIn || !checkOut) {
            return NextResponse.json({
                message: 'Check-in and check-out dates are required',
                rooms: [],
                total: 0
            }, { status: 400 });
        }

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return NextResponse.json({
                message: 'Invalid date format',
                rooms: [],
                total: 0
            }, { status: 400 });
        }

        // Get all rooms
        let allRooms = await prisma.room.findMany({
            where: {
                capacity: {
                    gte: Math.ceil(guests / roomCount) // Each room should accommodate guests/roomCount people
                }
            }
        });

        console.log('Found rooms:', allRooms);

        if (!allRooms) {
            allRooms = [];
        }

        // Get bookings for the date range
        const bookings = await prisma.booking.findMany({
            where: {
                roomId: {
                    in: allRooms.map(room => room.id)
                },
                OR: [
                    {
                        checkIn: {
                            lt: checkOutDate
                        },
                        checkOut: {
                            gt: checkInDate
                        }
                    }
                ],
                status: {
                    notIn: ['cancelled']
                }
            }
        });

        // Filter out rooms that have bookings in the selected date range
        const bookedRoomIds = new Set(bookings.map(booking => booking.roomId));
        const availableRooms = allRooms
            .filter(room => !bookedRoomIds.has(room.id))
            .map(room => ({
                id: room.id,
                name: room.name,
                description: room.description,
                price: room.price,
                capacity: room.capacity,
                type: room.type,
                images: room.images || [],
                amenities: room.amenities || [],
                bedType: room.bedType || 'Standard'
            }));

        console.log('Available rooms:', availableRooms);

        return NextResponse.json({
            rooms: availableRooms,
            total: availableRooms.length
        });
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        return NextResponse.json({
            message: 'An error occurred while fetching available rooms',
            rooms: [],
            total: 0
        }, { status: 500 });
    }
} 