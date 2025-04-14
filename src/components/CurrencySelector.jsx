import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

export function CurrencySelector() {
  const localization = useLocalization();
  // Safe access to localization context properties
  const currency = localization?.currency || 'USD';
  const setCurrency = localization?.setCurrency || (() => {});

  const currencies = [
    { code: 'USD', name: 'USD ($)' },
    { code: 'CAD', name: 'CAD (C$)' },
    { code: 'EUR', name: 'EUR (€)' },
    { code: 'GBP', name: 'GBP (£)' },
    { code: 'MXN', name: 'MXN (Mex$)' }
  ];

  const handleCurrencyChange = (e) => {
    if (typeof setCurrency === 'function') {
      setCurrency(e.target.value);
    }
  };

  return (
    <select
      value={currency}
      onChange={handleCurrencyChange}
      className="border-none text-gray-700 bg-white focus:outline-none focus:ring-0"
    >
      {currencies.map((curr) => (
        <option key={curr.code} value={curr.code}>
          {curr.name}
        </option>
      ))}
    </select>
  );
}