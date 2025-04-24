import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        // Check if test user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });

        if (!existingUser) {
            // Create test user
            const hashedPassword = await bcrypt.hash('testpassword123', 10);
            await prisma.user.create({
                data: {
                    email: 'test@example.com',
                    password: hashedPassword,
                    firstName: 'Test',
                    lastName: 'User',
                    emailVerified: true,
                    role: 'user'
                }
            });
            console.log('Test user created successfully');
        } else {
            console.log('Test user already exists');
        }
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser(); 