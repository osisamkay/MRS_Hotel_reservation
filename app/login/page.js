'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageHeader from '../../src/components/PageHeader';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    userId: '',
    password: '',
    form: ''
  });
  const [touchedFields, setTouchedFields] = useState({
    userId: false,
    password: false
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleBlur = (field) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };
  
  const validateField = (field) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'userId':
        if (!formData.userId.trim()) {
          newErrors.userId = 'User ID is required';
        } else {
          newErrors.userId = '';
        }
        break;
      case 'password':
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else {
          newErrors.password = '';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[field]; // Return true if no error
  };
  
  const validateForm = () => {
    const userIdValid = validateField('userId');
    const passwordValid = validateField('password');
    return userIdValid && passwordValid;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouchedFields({ userId: true, password: true });
    
    if (!validateForm()) {
      return;
    }
    
    // Here you would normally send a request to your backend to authenticate
    // For now, let's simulate a login
    if (formData.userId === 'admin' && formData.password === 'password') {
      // Successful login
      router.push('/success?type=login');
    } else {
      // Failed login
      setErrors(prev => ({ ...prev, form: 'Invalid user ID or password' }));
    }
  };
  
  return (
    <div className="bg-white min-h-screen">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-12 max-w-md">
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <p>{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-10" noValidate>
          <div>
            <label htmlFor="userId" className="block text-2xl font-medium text-gray-900 mb-3">
              User ID
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              required
              value={formData.userId}
              onChange={handleChange}
              onBlur={() => handleBlur('userId')}
              className={`appearance-none relative block w-full px-4 py-4 bg-mrs-gray border ${
                (touchedFields.userId || formSubmitted) && errors.userId ? 'border-red-500' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              aria-invalid={!!errors.userId && touchedFields.userId}
            />
            {(touchedFields.userId || formSubmitted) && errors.userId && (
              <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
            )}
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
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={`appearance-none relative block w-full px-4 py-4 bg-mrs-gray border ${
                  (touchedFields.password || formSubmitted) && errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                aria-invalid={!!errors.password && touchedFields.password}
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
            {(touchedFields.password || formSubmitted) && errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
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