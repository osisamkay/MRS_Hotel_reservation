import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/services/db';
import { sendBookingConfirmationEmail } from '@/src/lib/email';

/**
 * Process a payment for a booking
 */
export async function POST(request) {
  try {
    // Get session but don't require it
    const session = await getServerSession(authOptions);

    const paymentData = await request.json();

    // Validate required fields
    const requiredFields = ['bookingId', 'amount', 'method'];
    const missingFields = requiredFields.filter(field => !paymentData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the booking to check ownership
    const booking = await db.getBookingById(paymentData.bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Only the booking owner or admin/staff can process payment
    // If user is not authenticated, we'll allow the payment if it's a guest booking
    if (session) {
      // For authenticated users, check if they own the booking or have admin rights
      if (booking.userId !== session.user.id && !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
        return NextResponse.json(
          { error: 'Unauthorized to process payment for this booking' },
          { status: 403 }
        );
      }
    } else if (booking.userId) {
      // For unauthenticated users, only allow payment for guest bookings (no userId)
      return NextResponse.json(
        { error: 'Unauthorized to process payment for this booking' },
        { status: 403 }
      );
    }

    // In a real application, you would integrate with a payment processor here
    // For this demo, we'll simulate a successful payment

    // Create payment record - only include fields that are in the schema
    const newPayment = await db.createPayment({
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      method: paymentData.method,
      status: 'completed'
      // Note: cardLast4 is not in the schema, so we can't store it
    });

    // Update booking status to confirmed
    // Note: There is no paymentStatus field in the schema, only status
    await db.updateBooking(paymentData.bookingId, {
      status: 'confirmed'
    });

    // Get room details for the email
    const room = await db.getRoomById(booking.roomId);

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(booking, room);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the payment if email sending fails
    }

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
