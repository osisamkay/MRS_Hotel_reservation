'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import PageHeader from '../../src/components/PageHeader';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const getSuccessContent = () => {
    switch (type) {
      case 'registration':
        return {
          title: 'Registration Successful!',
          message: 'Your account has been created successfully. You can now log in and start booking your perfect stay at Moose Rock and Suites.',
          actionText: 'Go to Login',
          actionLink: '/login'
        };
      case 'reservation':
        return {
          title: 'Booking Confirmed!',
          message: 'Your reservation has been confirmed. Check your email for the booking details and confirmation number.',
          actionText: 'View My Bookings',
          actionLink: '/my-bookings'
        };
      case 'payment':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. A receipt has been sent to your email address.',
          actionText: 'View Booking Details',
          actionLink: '/my-bookings'
        };
      case 'password-reset':
        return {
          title: 'Password Reset Successful!',
          message: 'Your password has been reset successfully. You can now log in with your new password.',
          actionText: 'Go to Login',
          actionLink: '/login'
        };
      default:
        return {
          title: 'Success!',
          message: 'The operation was completed successfully.',
          actionText: 'Go to Home',
          actionLink: '/'
        };
    }
  };

  const content = getSuccessContent();

  return (
    <div className="bg-white min-h-screen">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-navy-700 mb-4 font-averia">
            {content.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {content.message}
          </p>
          
          <div className="space-y-4">
            <Link
              href={content.actionLink}
              className="block w-full bg-navy-700 text-white py-3 px-6 rounded-md text-lg font-medium font-averia hover:bg-navy-800 transition-colors"
            >
              {content.actionText}
            </Link>
            
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-md text-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}