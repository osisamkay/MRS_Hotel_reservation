/**
 * Utility functions for location detection and timezone management
 */

/**
 * Detects the user's location based on IP or browser settings
 * Returns a default location if detection fails
 */
export const detectUserLocation = async () => {
  // In a real app, this would use a geolocation API
  // For this demo, we'll return a default set of values
  return {
    country: 'US',
    language: 'en',
    currency: 'USD',
    timezone: 'America/New_York'
  };
};

/**
 * Gets the browser's locale information
 */
export const getBrowserLocale = () => {
  if (typeof window === 'undefined') {
    return 'en-US'; // Default for server-side rendering
  }
  
  return navigator.language || 'en-US';
};

/**
 * Gets the browser's timezone information
 */
export const getBrowserTimezone = () => {
  if (typeof window === 'undefined') {
    return 'UTC'; // Default for server-side rendering
  }
  
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
};

/**
 * Maps country codes to preferred currencies
 */
export const getPreferredCurrencyForCountry = (countryCode) => {
  const currencyMap = {
    'US': 'USD',
    'CA': 'CAD',
    'GB': 'GBP',
    'AU': 'AUD',
    'EU': 'EUR',
    'FR': 'EUR',
    'DE': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'MX': 'MXN'
  };
  
  return currencyMap[countryCode] || 'USD';
};

/**
 * Maps country codes to preferred languages
 */
export const getPreferredLanguageForCountry = (countryCode) => {
  const languageMap = {
    'US': 'en',
    'CA': 'en', // Could also be 'fr' depending on region
    'GB': 'en',
    'AU': 'en',
    'FR': 'fr',
    'DE': 'de',
    'IT': 'it',
    'ES': 'es',
    'MX': 'es'
  };
  
  return languageMap[countryCode] || 'en';
};