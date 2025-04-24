'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localizationServiceClient } from '../services/LocalizationServiceClient';

interface LocalizationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
  isLoading: boolean;
  detectedLocation: any;
  translate: (key: string) => string;
  convertCurrency: (amount: number) => number;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string, formatString: string) => string;
  formatRelativeTime: (date: Date | string) => string;
  validateBookingTime: (checkIn: Date | string, checkOut: Date | string) => boolean;
}

export const LocalizationContextClient = createContext<LocalizationContextType | null>(null);

interface LocalizationProviderProps {
  children: ReactNode;
}

export function LocalizationProviderClient({ children }: LocalizationProviderProps) {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<any>({
    language: 'en',
    currency: 'USD',
    timezone: 'UTC'
  });

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      const savedCurrency = localStorage.getItem('preferredCurrency');
      
      if (savedLanguage) setLanguage(savedLanguage);
      if (savedCurrency) setCurrency(savedCurrency);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', language);
      localStorage.setItem('preferredCurrency', currency);
    }
  }, [language, currency]);

  const value: LocalizationContextType = {
    language,
    setLanguage,
    currency,
    setCurrency,
    timezone,
    setTimezone,
    isLoading,
    detectedLocation,
    translate: (key) => localizationServiceClient.translate(key, language),
    convertCurrency: (amount) => {
      if (currency === 'USD') return amount;
      return localizationServiceClient.convertCurrency(amount, 'USD', currency);
    },
    formatCurrency: (amount) => localizationServiceClient.formatCurrency(amount, currency),
    formatDate: (date, formatString) => 
      localizationServiceClient.formatDate(date, formatString, timezone),
    formatRelativeTime: (date) => 
      localizationServiceClient.formatRelativeTime(date, timezone),
    validateBookingTime: (checkIn, checkOut) => 
      localizationServiceClient.validateBookingTime(checkIn, checkOut, timezone)
  };

  return (
    <LocalizationContextClient.Provider value={value}>
      {children}
    </LocalizationContextClient.Provider>
  );
}

export function useLocalizationClient(): LocalizationContextType {
  const context = useContext(LocalizationContextClient);
  if (!context) {
    throw new Error('useLocalizationClient must be used within a LocalizationProviderClient');
  }
  return context;
}
