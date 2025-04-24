interface CurrencyConfig {
    symbol: string;
    locale: string;
}

interface ExchangeRates {
    [key: string]: number;
}

class LocalizationService {
    private translations: { [key: string]: { [key: string]: string } };
    private exchangeRates: ExchangeRates;
    private currencyConfigs: { [key: string]: CurrencyConfig };

    constructor() {
        this.translations = {};
        this.exchangeRates = {};
        this.currencyConfigs = {
            USD: { symbol: '$', locale: 'en-US' },
            EUR: { symbol: '€', locale: 'de-DE' },
            GBP: { symbol: '£', locale: 'en-GB' },
            JPY: { symbol: '¥', locale: 'ja-JP' },
        };
    }

    async updateExchangeRates(): Promise<void> {
        try {
            // In a real app, fetch from an API like Open Exchange Rates
            this.exchangeRates = {
                USD: 1,
                EUR: 0.85,
                GBP: 0.73,
                JPY: 110.42,
            };
        } catch (error) {
            console.error('Failed to update exchange rates:', error);
            throw error;
        }
    }

    translate(key: string, language: string): string {
        return this.translations[language]?.[key] || key;
    }

    async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        if (fromCurrency === toCurrency) return amount;

        const fromRate = this.exchangeRates[fromCurrency];
        const toRate = this.exchangeRates[toCurrency];

        if (!fromRate || !toRate) {
            throw new Error('Invalid currency conversion');
        }

        return (amount / fromRate) * toRate;
    }

    formatCurrency(amount: number, currency: string): string {
        const config = this.currencyConfigs[currency];
        if (!config) {
            throw new Error(`Unsupported currency: ${currency}`);
        }

        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    }

    async formatDate(date: Date, formatString: string, timezone: string): Promise<string> {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            ...this.getDateFormatOptions(formatString),
        }).format(date);
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
            default:
                return {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                };
        }
    }

    async formatRelativeTime(date: Date, timezone: string): Promise<string> {
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
                .format(-Math.round(diffInHours), 'hours');
        }

        const diffInDays = diffInHours / 24;
        return new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
            .format(-Math.round(diffInDays), 'days');
    }

    async validateBookingTime(checkIn: Date, checkOut: Date, timezone: string): Promise<boolean> {
        const now = new Date();
        return checkIn > now && checkOut > checkIn;
    }
}

export const localizationService = new LocalizationService(); 