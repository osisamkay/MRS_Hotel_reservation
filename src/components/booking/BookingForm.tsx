// src/components/booking/BookingForm.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import { BookingFormData } from '@/src/types/booking';

interface BookingFormProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formErrors: Record<string, string>;
  processingPayment: boolean;
  paymentError: string;
  dateValidation: { isValid: boolean; error?: string };
}

interface CardInformation {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  formErrors,
  processingPayment,
  paymentError,
  dateValidation,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [cardInformation, setCardInformation] = useState<CardInformation>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces after every 4 digits
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setCardInformation({
      ...cardInformation,
      cardNumber: formatted
    });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setCardInformation({
      ...cardInformation,
      expiryDate: value
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`w-full p-2 border rounded ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className={`w-full p-2 border rounded ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-2 border rounded ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.email && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. (555) 123-4567"
              className={`w-full p-2 border rounded ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.phone && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Any special requirements or requests for your stay?"
          />
        </div>
      </div>

      {/* Payment Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        
        <div className="flex items-center mb-4">
          <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-sm text-gray-600">Secure Payment Processing</span>
        </div>
        
        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={() => setPaymentMethod('credit_card')}
                className="h-4 w-4 text-navy-700 focus:ring-navy-700"
              />
              <span className="ml-2">Credit Card</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="debit_card"
                checked={paymentMethod === 'debit_card'}
                onChange={() => setPaymentMethod('debit_card')}
                className="h-4 w-4 text-navy-700 focus:ring-navy-700"
              />
              <span className="ml-2">Debit Card</span>
            </label>
          </div>
        </div>

        {/* Credit Card Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              value={cardInformation.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full p-2 border rounded ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.cardNumber && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.cardNumber}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <input
              type="text"
              value={cardInformation.cardHolder}
              onChange={(e) => setCardInformation({ ...cardInformation, cardHolder: e.target.value })}
              placeholder="Name as it appears on card"
              className={`w-full p-2 border rounded ${formErrors.cardHolder ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formErrors.cardHolder && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.cardHolder}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                value={cardInformation.expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength={5}
                className={`w-full p-2 border rounded ${formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.expiryDate && (
                <p className="mt-1 text-red-500 text-xs">{formErrors.expiryDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="password"
                value={cardInformation.cvv}
                onChange={(e) => setCardInformation({ ...cardInformation, cvv: e.target.value.slice(0, 4) })}
                placeholder="123"
                maxLength={4}
                className={`w-full p-2 border rounded ${formErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formErrors.cvv && (
                <p className="mt-1 text-red-500 text-xs">{formErrors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Error Display */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{paymentError}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processingPayment || !dateValidation.isValid}
        className={`w-full py-3 px-4 rounded font-bold flex items-center justify-center ${
          processingPayment || !dateValidation.isValid
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-navy-700 hover:bg-navy-800 text-white'
        }`}
      >
        {processingPayment ? (
          <>
            <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-r-2 border-white rounded-full"></span>
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Complete Booking
          </>
        )}
      </button>
    </form>
  );
};

export default BookingForm;
export default BookingForm;
export default BookingForm;
export default BookingForm;
export default BookingForm;