import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
    try {
        // Check if super admin already exists
        const existingAdmin = await prisma.user.findFirst({
            where: {
                role: 'super_admin'
            }
        });

        if (existingAdmin) {
            console.log('Super admin already exists!');
            return;
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash('Admin@123', 12);

        const superAdmin = await prisma.user.create({
            data: {
                email: 'admin@hotelreservation.com',
                password: hashedPassword,
                firstName: 'Super',
                lastName: 'Admin',
                role: 'super_admin'
            }
        });

        console.log('Super admin created successfully:', {
            id: superAdmin.id,
            email: superAdmin.email,
            role: superAdmin.role
        });

    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the function
createSuperAdmin(); 