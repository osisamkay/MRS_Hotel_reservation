'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../src/components/Header';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-md">
        <form className="mt-8 space-y-10">
          <div>
            <label htmlFor="userId" className="block text-2xl font-medium text-gray-900 mb-3">
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-4 bg-mrs-gray border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-2xl font-medium text-gray-900 mb-3">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-4 py-4 bg-mrs-gray border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <div className="bg-gray-800 rounded-full p-2">
                  {showPassword ? 
                    <EyeOff className="h-5 w-5 text-white" /> : 
                    <Eye className="h-5 w-5 text-white" />
                  }
                </div>
              </button>
            </div>
          </div>
          
          <div className="mt-10">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 text-2xl font-medium text-white bg-mrs-blue hover:bg-navy-800 focus:outline-none"
            >
              LOG IN
            </button>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/forgot-password" className="text-mrs-blue hover:text-navy-900 text-xl">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 