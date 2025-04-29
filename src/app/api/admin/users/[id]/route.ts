import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await request.json();
        const { email, password, firstName, lastName, role } = body;

        // Get existing user
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Only super_admin can modify admin users
        if (existingUser.role === 'admin' && session.user.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Only super admin can modify admin users' },
                { status: 403 }
            );
        }

        // Prepare update data
        const updateData: any = {
            firstName,
            lastName,
            email,
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        // Only super_admin can change roles
        if (role && session.user.role === 'super_admin') {
            updateData.role = role;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession();

        if (!session?.user || !['admin', 'super_admin'].includes(session.user.role as string)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Get existing user
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Only super_admin can delete admin users
        if (existingUser.role === 'admin' && session.user.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Only super admin can delete admin users' },
                { status: 403 }
            );
        }

        // Prevent deleting the last super_admin
        if (existingUser.role === 'super_admin') {
            const superAdminCount = await prisma.user.count({
                where: { role: 'super_admin' },
            });

            if (superAdminCount <= 1) {
                return NextResponse.json(
                    { error: 'Cannot delete the last super admin' },
                    { status: 403 }
                );
            }
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 