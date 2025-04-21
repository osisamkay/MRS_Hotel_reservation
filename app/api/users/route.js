import { NextResponse } from 'next/server';
import { storageService } from '@/src/services/storage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Generate a random password
const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Send welcome email with credentials
const sendWelcomeEmail = async (email, username, password) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Welcome to MRS - Your Account Details',
        html: `
      <h1>Welcome to MRS Hotel Management System</h1>
      <p>Your account has been created successfully. Here are your login credentials:</p>
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Temporary Password:</strong> ${password}</p>
      <p>Please change your password after your first login for security purposes.</p>
      <p>Best regards,<br>MRS Team</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const users = await storageService.getAllUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { fullName, username, email, role, accessLevel } = data;

        // Validate required fields
        if (!fullName || !username || !email || !role || !accessLevel) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if username or email already exists
        const existingUser = await storageService.findUserByEmailOrUsername(email, username);
        if (existingUser) {
            return NextResponse.json(
                { error: 'Username or email already exists' },
                { status: 400 }
            );
        }

        // Generate temporary password
        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Create user
        const newUser = await storageService.createUser({
            fullName,
            username,
            email,
            role,
            accessLevel,
            password: hashedPassword,
            mustChangePassword: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Send welcome email with credentials
        await sendWelcomeEmail(email, username, temporaryPassword);

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await storageService.deleteUser(userId);

        return NextResponse.json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete user' },
            { status: 500 }
        );
    }
} 