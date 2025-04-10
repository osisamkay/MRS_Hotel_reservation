'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../src/components/Header';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would normally send a request to your backend
  };
  
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-md">
        <h1 className="text-2xl font-bold mb-8 font-serif border-b pb-4">Forgot Password</h1>
        
        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6">
            <p>If an account with that email exists, we've sent instructions to reset your password.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-200 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 text-xl font-medium text-white bg-mrs-blue hover:bg-navy-800 focus:outline-none"
              >
                Reset Password
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-mrs-blue hover:text-navy-900">
                Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 