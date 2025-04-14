import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

export function LanguageSelector() {
  const localization = useLocalization();
  // Safe access to localization context properties
  const language = localization?.language || 'en';
  const setLanguage = localization?.setLanguage || (() => {});

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];

  const handleLanguageChange = (e) => {
    if (typeof setLanguage === 'function') {
      setLanguage(e.target.value);
    }
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className="border-none text-gray-700 bg-white focus:outline-none focus:ring-0"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}