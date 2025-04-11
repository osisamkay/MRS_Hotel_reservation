'use client';

import { useState } from 'react';
import PageHeader from '../../src/components/PageHeader';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  // Add router
  const router = useRouter();
  
  // Form state
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    streetName: '',
    city: '',
    provinceState: '',
    country: '',
    postalCode: ''
  });
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Card details state
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    cvv: '',
    billingPostalCode: '',
    billingProvinceState: '',
    billingCountry: '',
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle billing info change
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Handle card details change
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Mark field as touched
  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field);
  };

  // Validate a single field
  const validateField = (field) => {
    const newErrors = { ...errors };
    
    // Required field validation
    if (field in billingInfo) {
      const value = billingInfo[field];
      
      if (!value.trim()) {
        newErrors[field] = 'This field is required';
      } else {
        // Field-specific validation
        switch (field) {
          case 'emailAddress':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              newErrors[field] = 'Please enter a valid email address';
            } else {
              newErrors[field] = '';
            }
            break;
            
          case 'phoneNumber':
            const phoneRegex = /^\d{10,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
              newErrors[field] = 'Please enter a valid phone number';
            } else {
              newErrors[field] = '';
            }
            break;
            
          case 'postalCode':
            // Simple validation for postal/zip code
            if (value.length < 5) {
              newErrors[field] = 'Please enter a valid postal/zip code';
            } else {
              newErrors[field] = '';
            }
            break;
            
          default:
            newErrors[field] = '';
        }
      }
    }
    
    // Credit card field validation
    if (field in cardDetails && (paymentMethod === 'creditCard' || paymentMethod === 'debitCard')) {
      const value = cardDetails[field];
      
      if (!value.trim()) {
        newErrors[field] = 'This field is required';
      } else {
        // Field-specific validation
        switch (field) {
          case 'cardNumber':
            // Remove spaces and check if it's a valid card number (simplified)
            const cardNumberClean = value.replace(/\s/g, '');
            if (!/^\d{15,16}$/.test(cardNumberClean)) {
              newErrors[field] = 'Please enter a valid card number';
            } else {
              // Basic Luhn algorithm check could be added here
              newErrors[field] = '';
            }
            break;
            
          case 'expiryMonth':
            // Check MM/YY format
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
              newErrors[field] = 'Please enter a valid expiry date (MM/YY)';
            } else {
              // Check if card is not expired
              const [month, year] = value.split('/');
              const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
              const today = new Date();
              
              if (expiryDate < today) {
                newErrors[field] = 'Card has expired';
              } else {
                newErrors[field] = '';
              }
            }
            break;
            
          case 'cvv':
            // Check if it's 3-4 digits
            if (!/^\d{3,4}$/.test(value)) {
              newErrors[field] = 'Please enter a valid CVV';
            } else {
              newErrors[field] = '';
            }
            break;
            
          default:
            newErrors[field] = '';
        }
      }
    }
    
    // Payment method validation
    if (field === 'paymentMethod') {
      if (!paymentMethod) {
        newErrors[field] = 'Please select a payment method';
      } else {
        newErrors[field] = '';
      }
    }
    
    setErrors(newErrors);
    return !newErrors[field];
  };

  // Validate entire form
  const validateForm = () => {
    // Create a list of all fields to validate
    const allFields = [
      // Billing info fields
      'firstName', 'lastName', 'phoneNumber', 'emailAddress', 'streetName',
      'city', 'provinceState', 'country', 'postalCode',
      // Payment method
      'paymentMethod'
    ];
    
    // Add card fields if credit/debit card is selected
    if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
      allFields.push(
        'cardholderName', 'cardNumber', 'expiryMonth', 'cvv',
        'billingPostalCode', 'billingProvinceState', 'billingCountry'
      );
    }
    
    // Validate all fields
    const validationResults = allFields.map(field => validateField(field));
    
    // Form is valid if all fields are valid
    return validationResults.every(Boolean);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Mark all required fields as touched
    const requiredFields = [
      // Billing info fields
      'firstName', 'lastName', 'phoneNumber', 'emailAddress', 'streetName',
      'city', 'provinceState', 'country', 'postalCode',
      // Payment method
      'paymentMethod'
    ];
    
    // Add card fields if credit/debit card is selected
    if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
      requiredFields.push(
        'cardholderName', 'cardNumber', 'expiryMonth', 'cvv',
        'billingPostalCode', 'billingProvinceState', 'billingCountry'
      );
    }
    
    const allTouched = requiredFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Process payment
    console.log('Processing payment with the following details:');
    console.log('Billing Info:', billingInfo);
    console.log('Payment Method:', paymentMethod);
    
    if (paymentMethod === 'creditCard' || paymentMethod === 'debitCard') {
      console.log('Card Details:', {
        ...cardDetails,
        cardNumber: '************' + cardDetails.cardNumber.slice(-4),
        cvv: '***' // Don't log actual CVV
      });
    }
    
    // In a real application, you would:
    // 1. Send this data to your backend
    // 2. Process the payment through a payment gateway
    // 3. Handle the response and redirect the user
    
    // For now, simulate a successful payment processing
    setTimeout(() => {
      // Redirect to success page with payment type
      router.push('/success?type=payment');
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen">
      <PageHeader />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Billing Address Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Billing Address:</h2>
            
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-md font-medium text-gray-900 mb-2">
                  First Name:
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={billingInfo.firstName}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('firstName')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.firstName || formSubmitted) && errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.firstName || formSubmitted) && errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-md font-medium text-gray-900 mb-2">
                  Last Name:
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={billingInfo.lastName}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('lastName')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.lastName || formSubmitted) && errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.lastName || formSubmitted) && errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-md font-medium text-gray-900 mb-2">
                  Phone Number:
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={billingInfo.phoneNumber}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('phoneNumber')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.phoneNumber || formSubmitted) && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.phoneNumber || formSubmitted) && errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="emailAddress" className="block text-md font-medium text-gray-900 mb-2">
                  Email Address:
                </label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  required
                  value={billingInfo.emailAddress}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('emailAddress')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.emailAddress || formSubmitted) && errors.emailAddress ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.emailAddress || formSubmitted) && errors.emailAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailAddress}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="streetName" className="block text-md font-medium text-gray-900 mb-2">
                  Street Name:
                </label>
                <input
                  id="streetName"
                  name="streetName"
                  type="text"
                  required
                  value={billingInfo.streetName}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('streetName')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.streetName || formSubmitted) && errors.streetName ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.streetName || formSubmitted) && errors.streetName && (
                  <p className="mt-1 text-sm text-red-600">{errors.streetName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-md font-medium text-gray-900 mb-2">
                  City:
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={billingInfo.city}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('city')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.city || formSubmitted) && errors.city ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.city || formSubmitted) && errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="provinceState" className="block text-md font-medium text-gray-900 mb-2">
                  Province/State:
                </label>
                <input
                  id="provinceState"
                  name="provinceState"
                  type="text"
                  required
                  value={billingInfo.provinceState}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('provinceState')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.provinceState || formSubmitted) && errors.provinceState ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.provinceState || formSubmitted) && errors.provinceState && (
                  <p className="mt-1 text-sm text-red-600">{errors.provinceState}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="country" className="block text-md font-medium text-gray-900 mb-2">
                  Country:
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={billingInfo.country}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('country')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.country || formSubmitted) && errors.country ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.country || formSubmitted) && errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-md font-medium text-gray-900 mb-2">
                  Postal Code/Zip Code:
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  value={billingInfo.postalCode}
                  onChange={handleBillingChange}
                  onBlur={() => handleBlur('postalCode')}
                  className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                    (touched.postalCode || formSubmitted) && errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {(touched.postalCode || formSubmitted) && errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Payment Method Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Pay With:</h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => handlePaymentMethodChange('cash')}
                    className="form-radio h-5 w-5 text-mrs-blue"
                  />
                  <span className="ml-2 text-gray-700">Cash</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="debitCard"
                    checked={paymentMethod === 'debitCard'}
                    onChange={() => handlePaymentMethodChange('debitCard')}
                    className="form-radio h-5 w-5 text-mrs-blue"
                  />
                  <span className="ml-2 text-gray-700">Debit Card</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === 'creditCard'}
                    onChange={() => handlePaymentMethodChange('creditCard')}
                    className="form-radio h-5 w-5 text-mrs-blue"
                  />
                  <span className="ml-2 text-gray-700">Credit Card</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="digitalWallet"
                    checked={paymentMethod === 'digitalWallet'}
                    onChange={() => handlePaymentMethodChange('digitalWallet')}
                    className="form-radio h-5 w-5 text-mrs-blue"
                  />
                  <span className="ml-2 text-gray-700">Digital Wallet</span>
                </label>
              </div>
              
              {(touched.paymentMethod || formSubmitted) && errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-8 items-center justify-start">
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/mastercard.png" 
                  alt="Mastercard" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/visa.png" 
                  alt="Visa" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/amex.png" 
                  alt="American Express" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/interac.png" 
                  alt="Interac" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/paypal.png" 
                  alt="PayPal" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/applepay.png" 
                  alt="Apple Pay" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/googlepay.png" 
                  alt="Google Pay" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
              
              <div className="h-16 w-16 relative">
                <img 
                  src="/assets/images/payment/samsungpay.png" 
                  alt="Samsung Pay" 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </div>
            </div>
          </div>
          
          {/* Payment Details Section - shown conditionally based on payment method */}
          {(paymentMethod === 'creditCard' || paymentMethod === 'debitCard') && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Payment Details:</h2>
              
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="cardholderName" className="block text-md font-medium text-gray-900 mb-2">
                    Cardholder Name:
                  </label>
                  <input
                    id="cardholderName"
                    name="cardholderName"
                    type="text"
                    required
                    value={cardDetails.cardholderName}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('cardholderName')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.cardholderName || formSubmitted) && errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {(touched.cardholderName || formSubmitted) && errors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cardNumber" className="block text-md font-medium text-gray-900 mb-2">
                    Card Number:
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    required
                    value={cardDetails.cardNumber}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('cardNumber')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.cardNumber || formSubmitted) && errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                  {(touched.cardNumber || formSubmitted) && errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="expiryMonth" className="block text-md font-medium text-gray-900 mb-2">
                    Expiry Month:
                  </label>
                  <input
                    id="expiryMonth"
                    name="expiryMonth"
                    type="text"
                    required
                    value={cardDetails.expiryMonth}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('expiryMonth')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.expiryMonth || formSubmitted) && errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="MM/YY"
                  />
                  {(touched.expiryMonth || formSubmitted) && errors.expiryMonth && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-md font-medium text-gray-900 mb-2">
                    CVV:
                  </label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="text"
                    required
                    value={cardDetails.cvv}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('cvv')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.cvv || formSubmitted) && errors.cvv ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="123"
                  />
                  {(touched.cvv || formSubmitted) && errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label htmlFor="billingPostalCode" className="block text-md font-medium text-gray-900 mb-2">
                    Postal Code/Zip Code:
                  </label>
                  <input
                    id="billingPostalCode"
                    name="billingPostalCode"
                    type="text"
                    required
                    value={cardDetails.billingPostalCode}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('billingPostalCode')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.billingPostalCode || formSubmitted) && errors.billingPostalCode ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {(touched.billingPostalCode || formSubmitted) && errors.billingPostalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingPostalCode}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="billingProvinceState" className="block text-md font-medium text-gray-900 mb-2">
                    Province/State:
                  </label>
                  <input
                    id="billingProvinceState"
                    name="billingProvinceState"
                    type="text"
                    required
                    value={cardDetails.billingProvinceState}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('billingProvinceState')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.billingProvinceState || formSubmitted) && errors.billingProvinceState ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {(touched.billingProvinceState || formSubmitted) && errors.billingProvinceState && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingProvinceState}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="billingCountry" className="block text-md font-medium text-gray-900 mb-2">
                    Country:
                  </label>
                  <input
                    id="billingCountry"
                    name="billingCountry"
                    type="text"
                    required
                    value={cardDetails.billingCountry}
                    onChange={handleCardDetailsChange}
                    onBlur={() => handleBlur('billingCountry')}
                    className={`appearance-none relative block w-full px-4 py-3 bg-mrs-gray border ${
                      (touched.billingCountry || formSubmitted) && errors.billingCountry ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {(touched.billingCountry || formSubmitted) && errors.billingCountry && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingCountry}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 text-2xl font-medium text-white bg-mrs-blue hover:bg-navy-800 focus:outline-none"
            >
              Proceed To Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 