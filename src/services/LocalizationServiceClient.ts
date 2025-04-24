interface CurrencyConfig {
    symbol: string;
    locale: string;
}

interface ExchangeRates {
    [key: string]: number;
}

class LocalizationServiceClient {
    private translations: { [key: string]: { [key: string]: string } };
    private exchangeRates: ExchangeRates;
    private currencyConfigs: { [key: string]: CurrencyConfig };

    constructor() {
        this.translations = {};
        this.exchangeRates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110.42,
        };
        this.currencyConfigs = {
            USD: { symbol: '$', locale: 'en-US' },
            EUR: { symbol: '€', locale: 'de-DE' },
            GBP: { symbol: '£', locale: 'en-GB' },
            JPY: { symbol: '¥', locale: 'ja-JP' },
        };
    }

    updateExchangeRates(): void {
        // In a client component, we'll use the hardcoded rates
        console.log('Using hardcoded exchange rates in client component');
    }

    translate(key: string, language: string): string {
        return this.translations[language]?.[key] || key;
    }

    convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
        if (fromCurrency === toCurrency) return amount;

        const fromRate = this.exchangeRates[fromCurrency];
        const toRate = this.exchangeRates[toCurrency];

        if (!fromRate || !toRate) {
            console.error('Invalid currency conversion');
            return amount;
        }

        return (amount / fromRate) * toRate;
    }

    formatCurrency(amount: number, currency: string): string {
        const config = this.currencyConfigs[currency];
        if (!config) {
            console.error(`Unsupported currency: ${currency}`);
            return `${amount}`;
        }

        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    }

    formatDate(date: Date | string, formatString: string, timezone: string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;

            return new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                ...this.getDateFormatOptions(formatString),
            }).format(dateObj);
        } catch (error) {
            console.error('Error formatting date:', error);
            return String(date);
        }
    }

    private getDateFormatOptions(formatString: string): Intl.DateTimeFormatOptions {
        switch (formatString) {
            case 'short':
                return {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                };
            case 'long':
                return {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                };
            case 'PPP':
                return {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                };
            default:
                return {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                };
        }
    }

    formatRelativeTime(date: Date | string, timezone: string): string {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            const now = new Date();
            const diffInHours = Math.abs(now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                    .format(-Math.round(diffInHours), 'hours');
            }

            const diffInDays = diffInHours / 24;
            return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                .format(-Math.round(diffInDays), 'days');
        } catch (error) {
            console.error('Error formatting relative time:', error);
            return String(date);
        }
    }

    validateBookingTime(checkIn: Date | string, checkOut: Date | string, timezone: string): boolean {
        try {
            const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
            const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
            const now = new Date();
            return checkInDate > now && checkOutDate > checkInDate;
        } catch (error) {
            console.error('Error validating booking time:', error);
            return false;
        }
    }
}

export const localizationServiceClient = new LocalizationServiceClient();
