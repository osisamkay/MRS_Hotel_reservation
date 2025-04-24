const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgres://neondb_owner:npg_EBQiol04THwX@ep-steep-math-a49rhqcb-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'
        }
    }
});

async function main() {
    try {
        // Test the connection
        await prisma.$connect();
        console.log('Successfully connected to the database!');

        // Create schema
        await prisma.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS public;');
        console.log('Schema created successfully!');

        // Create User table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `);
        console.log('User table created successfully!');

        // Create Room table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Room" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "capacity" INTEGER NOT NULL,
        "amenities" TEXT[] NOT NULL,
        "images" TEXT[] NOT NULL,
        "available" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
      );
    `);
        console.log('Room table created successfully!');

        // Create Booking table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Booking" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "roomId" TEXT NOT NULL,
        "checkIn" TIMESTAMP(3) NOT NULL,
        "checkOut" TIMESTAMP(3) NOT NULL,
        "guests" INTEGER NOT NULL,
        "totalPrice" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Booking_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);
        console.log('Booking table created successfully!');

        // Create Payment table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Payment" (
        "id" TEXT NOT NULL,
        "bookingId" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "method" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Payment_bookingId_key" UNIQUE ("bookingId"),
        CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);
        console.log('Payment table created successfully!');

        // Create Review table
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Review" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "roomId" TEXT NOT NULL,
        "bookingId" TEXT NOT NULL,
        "rating" INTEGER NOT NULL,
        "comment" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Review_bookingId_key" UNIQUE ("bookingId"),
        CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Review_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);
        console.log('Review table created successfully!');

        console.log('All tables created successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 