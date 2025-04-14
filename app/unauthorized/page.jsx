'use client';

import { useRouter } from 'next/navigation';
import PageHeader from '@/src/components/PageHeader';

export default function UnauthorizedPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => router.push('/')}
              className="bg-navy-700 text-white px-4 py-2 rounded hover:bg-navy-800"
            >
              Return to Home
            </button>
            
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-gray-800 text-white text-center mt-auto">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Moose Rock and Suites. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}