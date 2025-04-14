'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '../../src/components/PageHeader';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    form: ''
  });
  
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
        } else {
          newErrors.password = '';
        }
        break;
      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          newErrors.confirmPassword = '';
        }
        break;
      case 'firstName':
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        } else {
          newErrors.firstName = '';
        }
        break;
      case 'lastName':
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        } else {
          newErrors.lastName = '';
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
    const confirmPasswordValid = validateField('confirmPassword');
    const firstNameValid = validateField('firstName');
    const lastNameValid = validateField('lastName');
    return emailValid && passwordValid && confirmPasswordValid && firstNameValid && lastNameValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTouchedFields({
      email: true,
      password: true,
      confirmPassword: true,
      firstName: true,
      lastName: true
    });
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { confirmPassword, ...userData } = formData;
      
      // Make API call to create user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: `${userData.firstName} ${userData.lastName}`,
          role: 'user'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create account');
      }
      
      // Redirect to success page
      router.push('/success?type=registration');
    } catch (error) {
      setErrors(prev => ({ ...prev, form: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, label, type = 'text', showPasswordToggle = false, showState = null, setShowState = null) => (
    <div className="relative">
      <label htmlFor={name} className="block text-xl font-medium text-gray-900 mb-3 font-averia">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={showPasswordToggle ? (showState ? "text" : "password") : type}
          required
          value={formData[name]}
          onChange={handleChange}
          onBlur={() => handleBlur(name)}
          className={`appearance-none relative block w-full px-4 py-3 bg-gray-100 border ${
            (touchedFields[name] || formSubmitted) && errors[name] ? 'border-red-500' : 'border-gray-300'
          } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-1 focus:ring-navy-700 focus:border-navy-700 transition-colors`}
          aria-invalid={!!errors[name] && touchedFields[name]}
        />
        {showPasswordToggle && (
          <button 
            type="button" 
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowState(!showState)}
            aria-label={showState ? "Hide password" : "Show password"}
          >
            <div className="bg-navy-700 rounded-full p-1">
              {showState ? 
                <EyeOff className="h-4 w-4 text-white" /> : 
                <Eye className="h-4 w-4 text-white" />
              }
            </div>
          </button>
        )}
      </div>
      {(touchedFields[name] || formSubmitted) && errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-navy-700 font-averia">Create Your Account</h1>
        
        {errors.form && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <p>{errors.form}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                {renderInput('email', 'Email Address', 'email')}
              </div>
              <div>
                {renderInput('firstName', 'First Name')}
              </div>
              <div>
                {renderInput('lastName', 'Last Name')}
              </div>
              <div className="md:col-span-2">
                {renderInput('password', 'Password', 'password', true, showPassword, setShowPassword)}
              </div>
              <div className="md:col-span-2">
                {renderInput('confirmPassword', 'Confirm Password', 'password', true, showConfirmPassword, setShowConfirmPassword)}
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 text-lg font-averia font-medium text-white bg-navy-700 rounded-md hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-colors ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-navy-700 hover:text-navy-800 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}