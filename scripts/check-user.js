import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'osisami.oj90@gmail.com' },
            select: {
                email: true,
                emailVerified: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('User found:');
        console.log(JSON.stringify(user, null, 2));
    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser(); 