import crypto from 'crypto';
import { prisma } from './prisma';

export function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

export async function createVerificationToken(userId) {
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.user.update({
        where: { id: userId },
        data: {
            verifyToken: token,
            verifyTokenExpiry: expires,
        },
    });

    return token;
}

export async function createPasswordResetToken(userId) {
    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
        where: { id: userId },
        data: {
            resetToken: token,
            resetTokenExpiry: expires,
        },
    });

    return token;
}

export async function verifyToken(token, type = 'verification') {
    const user = await prisma.user.findFirst({
        where: {
            [type === 'verification' ? 'verifyToken' : 'resetToken']: token,
            [type === 'verification' ? 'verifyTokenExpiry' : 'resetTokenExpiry']: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        return null;
    }

    // Clear the token after verification
    await prisma.user.update({
        where: { id: user.id },
        data: {
            [type === 'verification' ? 'verifyToken' : 'resetToken']: null,
            [type === 'verification' ? 'verifyTokenExpiry' : 'resetTokenExpiry']: null,
            ...(type === 'verification' ? { emailVerified: true } : {}),
        },
    });

    return user;
} 