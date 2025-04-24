import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createUser() {
    try {
        const hashedPassword = await bcrypt.hash('Osisamkay007!', 10);

        const user = await prisma.user.create({
            data: {
                email: 'osisami.oj90@gmail.com',
                password: hashedPassword,
                firstName: 'Osisami',
                lastName: 'Oj',
                role: 'user',
                emailVerified: true // Set to true since we're auto-verifying
            }
        });

        console.log('User created successfully:');
        console.log(JSON.stringify(user, null, 2));
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createUser(); 