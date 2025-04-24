import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

export async function sendVerificationEmail(email, token) {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify your email',
        html: `
      <h1>Welcome to MRS Hotel!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
    });
}

export async function sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset your password',
        html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
    });
}

export async function sendBookingConfirmationEmail(booking, room) {
    const bookingUrl = `${process.env.NEXTAUTH_URL}/booking/confirmation/${booking.id}`;
    const checkInDate = new Date(booking.checkIn).toLocaleDateString();
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString();

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: booking.guestEmail,
        subject: 'Your Booking Confirmation - MRS Hotel',
        html: `
      <h1>Booking Confirmation</h1>
      <p>Dear ${booking.guestName},</p>
      <p>Thank you for choosing MRS Hotel. Your booking has been confirmed!</p>
      
      <h2>Booking Details:</h2>
      <ul>
        <li><strong>Booking ID:</strong> ${booking.id}</li>
        <li><strong>Room:</strong> ${room.name}</li>
        <li><strong>Check-in Date:</strong> ${checkInDate}</li>
        <li><strong>Check-out Date:</strong> ${checkOutDate}</li>
        <li><strong>Number of Guests:</strong> ${booking.guests}</li>
        <li><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</li>
      </ul>
      
      <p>You can view your booking details at any time by visiting:</p>
      <a href="${bookingUrl}">View Booking Details</a>
      
      <p>If you have any questions or need assistance, please contact our customer service.</p>
      
      <p>We look forward to welcoming you to MRS Hotel!</p>
      
      <p>Best regards,<br>MRS Hotel Team</p>
    `,
    });
}
