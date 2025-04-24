import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const db = {
    // Room operations
    getAllRooms: async () => {
        return prisma.room.findMany();
    },

    getRoomById: async (id) => {
        return prisma.room.findUnique({
            where: { id }
        });
    },

    getRoomAvailability: async (checkIn, checkOut) => {
        const bookedRooms = await prisma.booking.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { checkIn: { lte: checkOut } },
                            { checkOut: { gte: checkIn } }
                        ]
                    }
                ],
                status: { not: 'cancelled' }
            },
            select: { roomId: true }
        });

        const bookedRoomIds = bookedRooms.map(booking => booking.roomId);

        return prisma.room.findMany({
            where: {
                id: { notIn: bookedRoomIds },
                available: true
            }
        });
    },

    // Booking operations
    createBooking: async (bookingData) => {
        return prisma.booking.create({
            data: bookingData
        });
    },

    getBookingById: async (id) => {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                room: true,
                user: true
            }
        });
    },

    getUserBookings: async (userId) => {
        return prisma.booking.findMany({
            where: { userId },
            include: {
                room: true
            }
        });
    },

    updateBooking: async (id, updateData) => {
        return prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                room: true,
                user: true
            }
        });
    },

    deleteBooking: async (id) => {
        return prisma.booking.delete({
            where: { id }
        });
    },

    getAllBookings: async () => {
        return prisma.booking.findMany({
            include: {
                room: true,
                user: true
            }
        });
    },

    // User operations
    createUser: async (userData) => {
        return prisma.user.create({
            data: userData
        });
    },

    getUserByEmail: async (email) => {
        return prisma.user.findUnique({
            where: { email }
        });
    },

    // Payment operations
    createPayment: async (paymentData) => {
        return prisma.payment.create({
            data: paymentData
        });
    },

    getPaymentById: async (id) => {
        return prisma.payment.findUnique({
            where: { id },
            include: {
                booking: true
            }
        });
    },

    // Review operations
    createReview: async (reviewData) => {
        return prisma.review.create({
            data: reviewData
        });
    },

    getRoomReviews: async (roomId) => {
        return prisma.review.findMany({
            where: { roomId },
            include: {
                user: true
            }
        });
    }
};
