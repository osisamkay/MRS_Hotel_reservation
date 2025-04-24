import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres:Osisamkay007!@db.waoximlrzpskplqduodm.supabase.co:5432/postgres'
        }
    }
});

async function testConnection() {
    try {
        // Try to connect to the database
        await prisma.$connect();
        console.log('Successfully connected to the database!');

        // Try a simple query
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log('Test query successful:', result);
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection(); 