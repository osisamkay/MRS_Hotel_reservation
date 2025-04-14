import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { dataService } from '@/src/services/dataService';

/**
 * Process a payment for a booking
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

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
    const booking = await dataService.getBookingById(paymentData.bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Only the booking owner or admin/staff can process payment
    if (booking.userId !== session.user.id && !['admin', 'staff', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized to process payment for this booking' },
        { status: 403 }
      );
    }

    // In a real application, you would integrate with a payment processor here
    // For this demo, we'll simulate a successful payment
    
    // Create payment record
    const newPayment = await dataService.createPayment({
      bookingId: paymentData.bookingId,
      amount: paymentData.amount,
      method: paymentData.method,
      status: 'completed',
      // Store last 4 digits of card number if provided
      cardLast4: paymentData.cardDetails?.last4 || null
    });
    
    return NextResponse.json(newPayment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}