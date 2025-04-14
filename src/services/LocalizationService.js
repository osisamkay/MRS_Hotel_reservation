import axios from 'axios';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enUS, fr, es } from 'date-fns/locale';
import { logger } from '../utils/logger';

const LOCALES = {
  en: enUS,
  fr: fr,
  es: es
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  MXN: 'Mex$'
};

class LocalizationService {
  constructor() {
    this.supportedLanguages = ['en', 'fr', 'es'];
    this.defaultLanguage = 'en';
    this.exchangeRates = {};
    this.lastExchangeRateUpdate = null;
  }

  // Language Support
  getTranslations(language) {
    const translations = {
      en: {
        welcome: 'Welcome to Moose Rock and Suites',
        bookNow: 'Book Now',
        checkIn: 'Check In',
        checkOut: 'Check Out',
        guests: 'Guests',
        rooms: 'Rooms',
        search: 'Search',
        home: 'Home',
        amenities: 'Amenities',
        contact: 'Contact',
        language: 'Language',
        currency: 'Currency',
        login: 'Login',
        myBooking: 'My Booking',
        customerService: 'Customer Service',
        // Add more English translations
      },
      fr: {
        welcome: 'Bienvenue à Moose Rock and Suites',
        bookNow: 'Réserver',
        checkIn: 'Arrivée',
        checkOut: 'Départ',
        guests: 'Invités',
        rooms: 'Chambres',
        search: 'Rechercher',
        home: 'Accueil',
        amenities: 'Équipements',
        contact: 'Contact',
        language: 'Langue',
        currency: 'Devise',
        login: 'Connexion',
        myBooking: 'Ma Réservation',
        customerService: 'Service Client',
        // Add more French translations
      },
      es: {
        welcome: 'Bienvenido a Moose Rock and Suites',
        bookNow: 'Reservar',
        checkIn: 'Llegada',
        checkOut: 'Salida',
        guests: 'Huéspedes',
        rooms: 'Habitaciones',
        search: 'Buscar',
        home: 'Inicio',
        amenities: 'Servicios',
        contact: 'Contacto',
        language: 'Idioma',
        currency: 'Moneda',
        login: 'Iniciar Sesión',
        myBooking: 'Mi Reserva',
        customerService: 'Servicio al Cliente',
        // Add more Spanish translations
      }
    };

    return translations[language] || translations[this.defaultLanguage];
  }

  translate(key, language) {
    const translations = this.getTranslations(language);
    return translations[key] || key;
  }

  // Currency Conversion
  async updateExchangeRates() {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.EXCHANGE_RATE_API_KEY}`
          }
        }
      );

      this.exchangeRates = response.data.rates;
      this.lastExchangeRateUpdate = new Date();
      
      await logger.logSystemEvent({
        type: 'exchange_rates_update',
        status: 'success',
        data: { rates: this.exchangeRates }
      });
    } catch (error) {
      await logger.logError(error, { context: 'exchange_rates_update' });
      throw error;
    }
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    // Update rates if they're more than 1 hour old
    if (!this.lastExchangeRateUpdate || 
        (new Date() - this.lastExchangeRateUpdate) > 3600000) {
      await this.updateExchangeRates();
    }

    const fromRate = this.exchangeRates[fromCurrency] || 1;
    const toRate = this.exchangeRates[toCurrency] || 1;
    
    return (amount / fromRate) * toRate;
  }

  formatCurrency(amount, currency) {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    const formatter = new Intl.NumberFormat(this.getLocaleForCurrency(currency), {
      style: 'currency',
      currency: currency
    });

    return formatter.format(amount);
  }

  getLocaleForCurrency(currency) {
    const currencyLocales = {
      USD: 'en-US',
      EUR: 'fr-FR',
      GBP: 'en-GB',
      CAD: 'en-CA',
      MXN: 'es-MX'
    };

    return currencyLocales[currency] || 'en-US';
  }

  // Timezone Management
  async formatDate(date, formatString, timezone) {
    try {
      const locale = LOCALES[timezone] || LOCALES[this.defaultLanguage];
      return format(date, formatString, { locale });
    } catch (error) {
      await logger.logError(error, { context: 'date_formatting' });
      return format(date, formatString);
    }
  }

  async formatRelativeTime(date, timezone) {
    try {
      const locale = LOCALES[timezone] || LOCALES[this.defaultLanguage];
      return formatDistanceToNow(date, { locale });
    } catch (error) {
      await logger.logError(error, { context: 'relative_time_formatting' });
      return formatDistanceToNow(date);
    }
  }

  async convertTimezone(date, fromTimezone, toTimezone) {
    try {
      const fromDate = new Date(date.toLocaleString('en-US', { timeZone: fromTimezone }));
      const toDate = new Date(fromDate.toLocaleString('en-US', { timeZone: toTimezone }));
      return toDate;
    } catch (error) {
      await logger.logError(error, { context: 'timezone_conversion' });
      return date;
    }
  }

  // Booking Time Validation
  async validateBookingTime(checkIn, checkOut, timezone) {
    try {
      const now = new Date();
      const localCheckIn = await this.convertTimezone(checkIn, timezone, 'UTC');
      const localCheckOut = await this.convertTimezone(checkOut, timezone, 'UTC');
      const localNow = await this.convertTimezone(now, 'UTC', timezone);

      if (localCheckIn < localNow) {
        throw new Error('Check-in time cannot be in the past');
      }

      if (localCheckOut <= localCheckIn) {
        throw new Error('Check-out time must be after check-in time');
      }

      return true;
    } catch (error) {
      await logger.logError(error, { context: 'booking_time_validation' });
      throw error;
    }
  }
}

// Create and export a single instance
export const localizationService = new LocalizationService(); 