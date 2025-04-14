'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { localizationService } from '../services/LocalizationService';
import { detectUserLocation } from '../utils/locationUtils';

// Create and export the context
export const LocalizationContext = createContext(null);

export function LocalizationProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC');
  const [isLoading, setIsLoading] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState(null);

  // Initialize location-based settings
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsLoading(true);
        const location = await detectUserLocation();
        setDetectedLocation(location);
        setLanguage(location.language);
        setCurrency(location.currency);
        
        // Update exchange rates
        await localizationService.updateExchangeRates();
      } catch (error) {
        console.error('Failed to initialize localization settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', language);
      localStorage.setItem('preferredCurrency', currency);
    }
  }, [language, currency]);

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      const savedCurrency = localStorage.getItem('preferredCurrency');
      
      if (savedLanguage) setLanguage(savedLanguage);
      if (savedCurrency) setCurrency(savedCurrency);
    }
  }, []);

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    timezone,
    setTimezone,
    isLoading,
    detectedLocation,
    translate: (key) => localizationService.translate(key, language),
    convertCurrency: async (amount) => {
      if (currency === 'USD') return amount;
      return await localizationService.convertCurrency(amount, 'USD', currency);
    },
    formatCurrency: (amount) => localizationService.formatCurrency(amount, currency),
    formatDate: async (date, formatString) => 
      await localizationService.formatDate(date, formatString, timezone),
    formatRelativeTime: async (date) => 
      await localizationService.formatRelativeTime(date, timezone),
    validateBookingTime: async (checkIn, checkOut) => 
      await localizationService.validateBookingTime(checkIn, checkOut, timezone)
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
} 