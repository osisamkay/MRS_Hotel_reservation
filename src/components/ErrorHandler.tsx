// src/components/ErrorHandler.tsx
'use client';

import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorHandlerProps {
  title?: string;
  message: string;
  severity?: ErrorSeverity;
  onRetry?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  showRetryButton?: boolean;
}

/**
 * A reusable error handler component to display error messages consistently across the application
 */
const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  title,
  message,
  severity = 'error',
  onRetry,
  onBack,
  showBackButton = true,
  showRetryButton = true,
}) => {
  // Define colors based on severity
  const getSeverityColors = (): { bg: string; border: string; text: string } => {
    switch (severity) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
        };
    }
  };

  const colors = getSeverityColors();

  return (
    <div className={`${colors.bg} border ${colors.border} ${colors.text} px-4 py-5 rounded-lg`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="ml-3">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          <div className="mt-2">
            <p className="text-sm">{message}</p>
          </div>
          
          {(showBackButton || showRetryButton) && (
            <div className="mt-4 flex space-x-3">
              {showBackButton && (
                <button
                  type="button"
                  onClick={onBack || (() => window.history.back())}
                  className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Go Back
                </button>
              )}
              
              {showRetryButton && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="flex items-center bg-navy-700 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-navy-800"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;