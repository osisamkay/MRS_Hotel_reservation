'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function ErrorAlert({ message, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  
  if (!message || dismissed) return null;
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6 flex items-start">
      <AlertTriangle className="h-5 w-5 mr-2 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-grow">
        <p>{message}</p>
      </div>
      <button 
        onClick={handleDismiss}
        className="ml-2 text-gray-500 hover:text-gray-700"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}