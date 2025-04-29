import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';
import bcrypt from 'bcryptjs';

// Helper function to check admin authorization
async function checkAdminAuthorization() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: 'No session found', status: 401 };
    }

    if (!['admin', 'super_admin'].includes(session.user.role as string)) {
        return { error: 'Insufficient permissions', status: 401 };
    }

    return null;
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authError = await checkAdminAuthorization();
        if (authError) {
            return NextResponse.json(
                { error: authError.error },
                { status: authError.status }
            );
        }

        const userId = params.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Format the response to match your frontend expectations
        return NextResponse.json({
            ...user,
            fullName: `${user.firstName} ${user.lastName}`.trim()
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authError = await checkAdminAuthorization();
        if (authError) {
            return NextResponse.json(
                { error: authError.error },
                { status: authError.status }
            );
        }

        const userId = params.id;
        const data = await request.json();

        // Verify user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData: any = {};

        // Handle fullName update
        if (data.fullName) {
            const [firstName, ...lastNameParts] = data.fullName.split(' ');
            const lastName = lastNameParts.join(' ');
            updateData.firstName = firstName;
            updateData.lastName = lastName || '';
        }

        // Handle other fields
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;

        // If password is provided, hash it
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const authError = await checkAdminAuthorization();
        if (authError) {
            return NextResponse.json(
                { error: authError.error },
                { status: authError.status }
            );
        }

        const userId = params.id;

        // Verify user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if trying to delete the last admin
        if (existingUser.role === 'admin' || existingUser.role === 'super_admin') {
            const adminCount = await prisma.user.count({
                where: {
                    role: {
                        in: ['admin', 'super_admin']
                    }
                }
            });

            if (adminCount <= 1) {
                return NextResponse.json(
                    { error: 'Cannot delete the last admin user' },
                    { status: 400 }
                );
            }
        }

        // Delete user
        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
} 