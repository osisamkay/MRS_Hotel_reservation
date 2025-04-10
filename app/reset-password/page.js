'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../src/components/Header';
import { Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touchedFields, setTouchedFields] = useState({
    password: false,
    confirmPassword: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Password validation state
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperLower: false,
    hasNumber: false,
    hasSpecial: false,
    passwordsMatch: false
  });
  
  // Check validations when password changes
  useEffect(() => {
    setValidations({
      minLength: password.length >= 10,
      hasUpperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPassword && password !== ''
    });
  }, [password, confirmPassword]);

  // Mark field as touched when it loses focus
  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouchedFields({ password: true, confirmPassword: true });
    
    // Check if form is valid
    const isValid = Object.values(validations).every(Boolean);
    
    if (!isValid) {
      // Find the first validation that failed
      if (!validations.minLength) {
        setFormError('Password must be at least 10 characters long');
      } else if (!validations.hasUpperLower) {
        setFormError('Password must contain both uppercase and lowercase letters');
      } else if (!validations.hasNumber) {
        setFormError('Password must contain at least one number');
      } else if (!validations.hasSpecial) {
        setFormError('Password must contain at least one special character');
      } else if (!validations.passwordsMatch) {
        setFormError('Passwords do not match');
      }
      return;
    }
    
    // If everything is valid, clear errors and proceed
    setFormError('');
    
    // Here you would normally send a request to your backend to reset the password
    alert('Password reset successful! Redirecting to login page...');
    // In a real app, you would redirect to login page after a successful reset
  };
  
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <h1 className="text-4xl font-bold text-center mb-6">Reset Your Password</h1>
        
        <p className="text-center text-lg mb-12">
          Enter a new password to reset the password on your account. We'll ask for this password whenever you log in.
        </p>
        
        {formError && formSubmitted && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <p>{formError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-10" noValidate>
          <div className="relative">
            <label htmlFor="password" className="block text-xl font-medium text-gray-900 mb-3">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`appearance-none relative block w-full px-4 py-4 bg-mrs-gray border ${
                  (touchedFields.password || formSubmitted) && !validations.minLength ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                aria-invalid={!validations.minLength && touchedFields.password}
                aria-describedby="password-requirements"
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
          
          <div id="password-requirements" className="space-y-1 text-md">
            <div className="flex items-center">
              {validations.minLength ? 
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                <XCircle className={`h-5 w-5 ${(touchedFields.password || formSubmitted) ? 'text-red-500' : 'text-gray-400'} mr-2`} />}
              <p className={validations.minLength ? "text-navy-700 font-medium" : (touchedFields.password || formSubmitted) ? "text-red-700" : "text-navy-700"}>
                Must be at least 10 characters long
              </p>
            </div>
            <div className="flex items-center">
              {validations.hasUpperLower ? 
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                <XCircle className={`h-5 w-5 ${(touchedFields.password || formSubmitted) ? 'text-red-500' : 'text-gray-400'} mr-2`} />}
              <p className={validations.hasUpperLower ? "text-navy-700 font-medium" : (touchedFields.password || formSubmitted) ? "text-red-700" : "text-navy-700"}>
                Must contain an uppercase and a lowercase letter (A,z)
              </p>
            </div>
            <div className="flex items-center">
              {validations.hasNumber ? 
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                <XCircle className={`h-5 w-5 ${(touchedFields.password || formSubmitted) ? 'text-red-500' : 'text-gray-400'} mr-2`} />}
              <p className={validations.hasNumber ? "text-navy-700 font-medium" : (touchedFields.password || formSubmitted) ? "text-red-700" : "text-navy-700"}>
                Must contain a number
              </p>
            </div>
            <div className="flex items-center">
              {validations.hasSpecial ? 
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> : 
                <XCircle className={`h-5 w-5 ${(touchedFields.password || formSubmitted) ? 'text-red-500' : 'text-gray-400'} mr-2`} />}
              <p className={validations.hasSpecial ? "text-navy-700 font-medium" : (touchedFields.password || formSubmitted) ? "text-red-700" : "text-navy-700"}>
                Must contain a special character (!, @, #, $, %, &, etc)
              </p>
            </div>
          </div>
          
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-xl font-medium text-gray-900 mb-3">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`appearance-none relative block w-full px-4 py-4 bg-mrs-gray border ${
                  (touchedFields.confirmPassword || formSubmitted) && password && !validations.passwordsMatch ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                aria-invalid={!validations.passwordsMatch && touchedFields.confirmPassword && password}
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <div className="bg-gray-800 rounded-full p-2">
                  {showConfirmPassword ? 
                    <EyeOff className="h-5 w-5 text-white" /> : 
                    <Eye className="h-5 w-5 text-white" />
                  }
                </div>
              </button>
            </div>
            {(touchedFields.confirmPassword || formSubmitted) && password && !validations.passwordsMatch && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
          
          <div className="mt-10">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 text-2xl font-medium text-white bg-mrs-blue hover:bg-navy-800 focus:outline-none"
            >
              Reset Password
            </button>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/login" className="text-mrs-blue hover:text-navy-900 text-xl">
              Know Your Password? Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 