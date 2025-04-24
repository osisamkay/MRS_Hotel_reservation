'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import PageHeader from '@/src/components/PageHeader';
import { signIn } from 'next-auth/react';
import ErrorAlert from '@/src/components/ui/ErrorAlert';
import { useNotification } from '@/src/contexts/NotificationContext';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: ''
  });

  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get callback URL from query parameters (for redirecting after successful login)
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Get error from query parameters if authentication failed
  const error = searchParams.get('error');

  // Set error message based on URL error parameter
  useEffect(() => {
    if (error === 'CredentialsSignin') {
      setErrors(prev => ({ ...prev, form: 'Invalid email or password' }));
      showNotification('error', 'Invalid email or password');
    }
  }, [error, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          newErrors.email = '';
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
    return !newErrors[field];
  };

  const validateForm = () => {
    const emailValid = validateField('email');
    const passwordValid = validateField('password');
    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouchedFields({
      email: true,
      password: true
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, form: '' }));

    try {
      // Use NextAuth's signIn function directly
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (result.error) {
        setErrors(prev => ({
          ...prev,
          form: 'Invalid email or password'
        }));
        showNotification('error', 'Invalid email or password');
      } else {
        // Show success notification
        showNotification('success', 'Login successful');
        
        // Get user session to check role
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else {
          // Redirect to callback URL or home page
          router.push(callbackUrl);
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setErrors(prev => ({
        ...prev,
        form: errorMessage
      }));
      showNotification('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <PageHeader />

      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold text-center text-navy-700 font-averia mb-8">
          Welcome Back
        </h1>

        <ErrorAlert
          message={errors.form}
          onDismiss={() => setErrors(prev => ({ ...prev, form: '' }))}
        />

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-2 font-averia">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 bg-gray-100 border ${touchedFields.email && errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-navy-700 focus:border-navy-700 transition-colors`}
              />
              {touchedFields.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xl font-medium text-gray-700 mb-2 font-averia">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-navy-700 hover:text-navy-800 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`w-full px-4 py-3 bg-gray-100 border ${touchedFields.password && errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-navy-700 focus:border-navy-700 transition-colors`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <div className="bg-navy-700 rounded-full p-1">
                    {showPassword ?
                      <EyeOff className="h-4 w-4 text-white" /> :
                      <Eye className="h-4 w-4 text-white" />
                    }
                  </div>
                </button>
              </div>
              {touchedFields.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 text-lg font-averia font-medium text-white bg-navy-700 rounded-md hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-r-2 border-white rounded-full"></span>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="text-navy-700 hover:text-navy-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}