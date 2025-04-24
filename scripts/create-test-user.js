import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
    try {
        const email = 'test@example.com';
        const password = 'testpassword123';

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            // Update existing user to ensure email is verified
            await prisma.user.update({
                where: { email },
                data: {
                    emailVerified: true
                }
            });
            console.log('Test user updated with verified email');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create test user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                emailVerified: true,
                role: 'user'
            }
        });

        console.log('Test user created successfully:');
        console.log('Email:', email);
        console.log('Password:', password);
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestUser(); 