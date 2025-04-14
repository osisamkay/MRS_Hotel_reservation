'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageHeader from '../../src/components/PageHeader';
import { AlertTriangle } from 'lucide-react';
import { passwordService } from '../../src/utils/storageService';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };
  
  const handleBlur = () => {
    setTouched(true);
    validateEmail(email);
  };
  
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (touched) {
      validateEmail(e.target.value);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const resetToken = await passwordService.requestReset(email);
      // In a real application, you would send this token via email
      // For demo purposes, we'll redirect to the reset page with the token
      setSuccess(true);
      // Uncomment the following line in production when email sending is implemented
      // router.push('/reset-password?token=' + resetToken);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white min-h-screen">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-12 max-w-md">
        <h1 className="text-2xl font-bold mb-8 font-serif border-b pb-4">Forgot Password</h1>
        
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <p>{formError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-md font-medium text-gray-900 mb-3">
              Please enter your email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                (touched || formSubmitted) && emailError ? 'border-red-500' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email"
              aria-invalid={!!emailError && touched}
            />
            {(touched || formSubmitted) && emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 text-xl font-medium text-white bg-mrs-blue hover:bg-navy-800 focus:outline-none"
            >
              Send Reset Link
            </button>
          </div>
          
          <div className="text-center mt-4">
            <Link href="/login" className="text-mrs-blue hover:text-navy-900">
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 