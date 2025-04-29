import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/src/lib/prisma';
import { authOptions } from '@/src/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            console.log('No session found');
            return NextResponse.json({ error: 'No session found' }, { status: 401 });
        }

        if (!['admin', 'super_admin'].includes(session.user.role as string)) {
            console.log('Invalid role:', session.user.role);
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
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

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Add detailed session debugging
        console.log('Session debug:', {
            exists: !!session,
            user: session?.user,
            role: session?.user?.role
        });

        if (!session?.user) {
            console.log('No session found in POST request');
            return NextResponse.json({ error: 'No session found' }, { status: 401 });
        }

        if (!['admin', 'super_admin'].includes(session.user.role as string)) {
            console.log('Invalid role in POST request:', session.user.role);
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 401 });
        }

        const data = await request.json();

        // Validate incoming data
        if (!data.email || !data.fullName || !data.role) {
            return NextResponse.json(
                { error: 'Missing required fields: email, fullName, role' },
                { status: 400 }
            );
        }

        // Split fullName into firstName and lastName
        const [firstName, ...lastNameParts] = data.fullName.split(' ');
        const lastName = lastNameParts.join(' ');

        // Generate a temporary password (you might want to send this via email)
        const temporaryPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            );
        }

        // Create new user with transformed data
        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                firstName: firstName,
                lastName: lastName || '', // Handle case where no last name is provided
                role: data.role,
                password: hashedPassword
            }
        });

        // Remove password from response and include the temporary password
        const { password, ...userWithoutPassword } = newUser;

        return NextResponse.json({
            ...userWithoutPassword,
            temporaryPassword, // Include this so it can be communicated to the user
            message: 'User created successfully. Please securely communicate the temporary password to the user.'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
} 