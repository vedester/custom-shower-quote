import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2 justify-end mb-4">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage('es')}
        className={`px-3 py-1 rounded ${i18n.language === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      >
        ES
      </button>
    </div>
  );
}