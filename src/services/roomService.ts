// src/services/roomService.ts
import { Room, RoomSearchParams } from '@/src/types/booking';
import { prisma } from '@/src/lib/prisma';
import { Booking } from '@prisma/client';

interface RoomWithBookings extends Room {
    bookings: Booking[];
}

interface BookedRoom {
    roomId: string;
}

/**
 * Get a room by ID
 * @param id The room ID
 * @returns The room or null if not found
 */
export async function getRoom(id: string): Promise<Room | null> {
    try {
        const room = await prisma.room.findUnique({
            where: { id },
            include: {
                bookings: true,
            },
        });

        if (!room) {
            return null;
        }

        return {
            ...room,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
        };
    } catch (error) {
        console.error('Error fetching room:', error);
        throw new Error('Failed to fetch room');
    }
}

/**
 * Search available rooms based on search parameters
 * @param params Search parameters
 * @returns Array of available rooms
 */
export async function searchRooms(params: RoomSearchParams): Promise<Room[]> {
    try {
        const { checkIn, checkOut, guests, rooms: roomCount } = params;

        // Convert dates to Date objects
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Validate dates
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            throw new Error('Invalid date format');
        }

        // Find rooms that are not booked during the requested period
        const bookedRoomIds = await prisma.booking.findMany({
            where: {
                OR: [
                    {
                        checkIn: {
                            lt: checkOutDate,
                        },
                        checkOut: {
                            gt: checkInDate,
                        },
                    },
                ],
                status: {
                    notIn: ['cancelled'],
                },
            },
            select: {
                roomId: true,
            },
        });

        // Get unique room IDs that are booked
        const bookedIds = [...new Set(bookedRoomIds.map((booking) => booking.roomId))];

        // Find available rooms with sufficient capacity
        const availableRooms = await prisma.room.findMany({
            where: {
                id: {
                    notIn: bookedIds,
                },
                capacity: {
                    gte: guests,
                },
                available: true,
            },
        });

        return availableRooms.map(room => ({
            ...room,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error searching rooms:', error);
        throw new Error('Failed to search for rooms');
    }
}

/**
 * Get all rooms (for admin use)
 * @returns Array of all rooms
 */
export async function getAllRooms(): Promise<Room[]> {
    try {
        const rooms = await prisma.room.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return rooms.map(room => ({
            ...room,
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching all rooms:', error);
        throw new Error('Failed to fetch rooms');
    }
}

export class RoomService {
    async getAllRooms(): Promise<Room[]> {
        return prisma.room.findMany();
    }

    async getRoomById(id: string): Promise<RoomWithBookings | null> {
        return prisma.room.findUnique({
            where: { id },
            include: {
                bookings: true,
            },
        }) as Promise<RoomWithBookings | null>;
    }

    async createRoom(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> {
        return prisma.room.create({
            data,
        });
    }

    async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
        return prisma.room.update({
            where: { id },
            data,
        });
    }

    async deleteRoom(id: string): Promise<Room> {
        return prisma.room.delete({
            where: { id },
        });
    }

    async getAvailableRooms(
        checkIn: Date,
        checkOut: Date,
        guests: number
    ): Promise<Room[]> {
        try {
            // Find all bookings that overlap with the requested dates
            const bookedRoomIds = await prisma.booking.findMany({
                where: {
                    OR: [
                        {
                            AND: [
                                { checkIn: { lte: checkIn } },
                                { checkOut: { gt: checkIn } },
                            ],
                        },
                        {
                            AND: [
                                { checkIn: { lt: checkOut } },
                                { checkOut: { gte: checkOut } },
                            ],
                        },
                        {
                            AND: [
                                { checkIn: { gte: checkIn } },
                                { checkOut: { lte: checkOut } },
                            ],
                        },
                    ],
                },
                select: {
                    roomId: true,
                },
            }) as BookedRoom[];

            // Get unique room IDs that are booked
            const bookedIds = [...new Set(bookedRoomIds.map(booking => booking.roomId))];

            // Find available rooms with sufficient capacity
            const availableRooms = await prisma.room.findMany({
                where: {
                    AND: [
                        { id: { notIn: bookedIds } },
                        { capacity: { gte: guests } },
                    ],
                },
            });

            return availableRooms;
        } catch (error) {
            console.error('Error finding available rooms:', error);
            throw error;
        }
    }

    async getRoomAvailability(roomId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const bookings = await prisma.booking.findMany({
            where: {
                roomId,
                OR: [
                    {
                        AND: [
                            { checkIn: { lte: startDate } },
                            { checkOut: { gt: startDate } },
                        ],
                    },
                    {
                        AND: [
                            { checkIn: { lt: endDate } },
                            { checkOut: { gte: endDate } },
                        ],
                    },
                    {
                        AND: [
                            { checkIn: { gte: startDate } },
                            { checkOut: { lte: endDate } },
                        ],
                    },
                ],
            },
        });

        return bookings.length === 0;
    }
}