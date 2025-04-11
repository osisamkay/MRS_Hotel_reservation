'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '../../src/components/PageHeader';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [successData, setSuccessData] = useState({
    title: 'Success!',
    message: 'Your request has been processed successfully!',
    type: 'generic'
  });
  
  useEffect(() => {
    // Get the success type from URL parameters (payment, login, reset)
    const type = searchParams.get('type');
    
    if (type) {
      switch(type) {
        case 'payment':
          setSuccessData({
            title: 'Payment Successful!',
            message: 'Thank You for choosing Moose Rock and Suites. Your receipt and booking confirmation have been sent your email!',
            type: 'payment'
          });
          break;
        case 'login':
          setSuccessData({
            title: 'Login Successful!',
            message: 'You\'re in! Welcome back to Moose Rock and Suites, where your next great stay begins!',
            type: 'login'
          });
          break;
        case 'reset':
          setSuccessData({
            title: 'Password Reset Successful!',
            message: 'Your password has been successfully reset. You can use your new password to login to your account!',
            type: 'reset'
          });
          break;
        default:
          // Use default values
          break;
      }
    }
    
    // If no valid type is provided, redirect to home after a delay
    if (!type || !['payment', 'login', 'reset'].includes(type)) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <div className="bg-white min-h-screen">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          {/* Either use an SVG or a placeholder for the success checkmark icon */}
          <div className="h-36 w-36 relative bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-32 w-32 text-white" />
          </div>
        </div>
        
        {/* Success Title */}
        <h1 className="text-5xl font-bold text-green-700 mb-10">{successData.title}</h1>
        
        {/* Success Message */}
        <p className="text-xl mb-16 text-center w-full max-w-[610px] mx-auto">
          {successData.message}
        </p>
        
        {/* Back to Homepage Button */}
        <Link 
          href="/"
          className="block w-full bg-mrs-blue text-white py-4 px-6 text-2xl font-medium focus:outline-none hover:bg-navy-800"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
} 