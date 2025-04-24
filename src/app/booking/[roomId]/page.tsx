// app/booking/[roomId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { useNotification } from '@/src/contexts/NotificationContext';
import { useLocalization } from '@/src/contexts/LocalizationContext';
import PageHeader from '@/src/components/PageHeader';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { validateBookingDates } from '@/src/utils/bookingUtils';
import { BookingFormData } from '@/src/types/booking';
import { formatISO, differenceInDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

import { getRoomById } from '@/lib/actions/room.actions';
import { createBooking } from '@/lib/actions/booking.actions';
import { Room } from '@/lib/models/room.model';

interface DateValidation {
  isValid: boolean;
  error?: string;
  nights: number;
}

// Dynamic imports for better code splitting
const BookingForm = dynamic(() => import('@/src/components/booking/BookingForm'), {
  loading: () => <div className="bg-gray-100 p-6 rounded-lg animate-pulse h-96"></div>
});

const BookingSummary = dynamic(() => import('@/src/components/booking/BookingSummary'), {
  loading: () => <div className="bg-gray-100 p-6 rounded-lg animate-pulse h-96"></div>
});

interface BookingPageProps {
  params: {
    roomId: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const { roomId } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { formatCurrency } = useLocalization();
  const { showNotification } = useNotification();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [dates, setDates] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  });
  const [guestCount, setGuestCount] = useState(Number(searchParams.get('guests') || '1'));
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  
  // Validate dates
  const dateValidation = validateBookingDates(dates.checkIn, dates.checkOut) as DateValidation;

  const calculateTotalPrice = (checkIn: string, checkOut: string, pricePerNight: number) => {
    const days = differenceInDays(new Date(checkOut), new Date(checkIn));
    return days * pricePerNight;
  };

  // Fetch room details on component mount
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms/${roomId}`);
        if (!response.ok) {
          throw new Error('Room not found');
        }
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.firstName || prevData.firstName,
        lastName: user.lastName || prevData.lastName,
        email: user.email || prevData.email,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const totalPrice = calculateTotalPrice(
        dates.checkIn,
        dates.checkOut,
        room.pricePerNight
      );

      const bookingData = {
        roomId,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        guests: guestCount,
        totalPrice,
        specialRequests: formData.specialRequests,
        ...(session ? {} : {
          guestInfo: {
            name: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            phone: formData.phone
          }
        })
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    setPaymentError('');

    try {
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount: room.pricePerNight * dateValidation.nights,
          paymentMethod,
          cardDetails: {
            number: cardNumber,
            expiry: cardExpiry,
            cvc: cardCvc,
            name: nameOnCard
          }
        }),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }

      setBookingComplete(true);
      showNotification('Payment processed successfully', 'success');
      
      // Redirect to success page
      router.push(`/booking/confirmation?bookingId=${bookingId}`);
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error?.message || 'Payment failed. Please try again.');
      showNotification(error?.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };
}