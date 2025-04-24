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
        // Test connection
        await prisma.$connect();
        console.log('Successfully connected to the database!');

        // Fetch admin user
        const admin = await prisma.user.findFirst({
            where: {
                email: 'admin@hotel.com'
            }
        });
        console.log('Admin user:', admin);

        // Fetch all rooms
        const rooms = await prisma.room.findMany({
            take: 5 // Get first 5 rooms
        });
        console.log('First 5 rooms:', rooms);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main(); 