// Main entry for the app with routing and UI layout
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
import Contact from "./pages/Contact";
import './App.css'; // Optional general styles
import './i18n/i18n'; // i18n config
import { useTranslation } from "react-i18next";
//import './output.css'; // or whatever path you used for -o

// Dictionary for model images
const modelImages = {
  // Format: 'model_code': 'image_path'
  'MTI-101': '/images/models/MTI-101.jpeg',
  'MTI-102': '/images/models/MTI-102.jpg',
  'MTI-103': '/images/models/MTI-103.jpg',
  'MTI-201': '/images/models/MTI-201.jpeg',
  // ... other models ...
};

function App() {
  const { t } = useTranslation();

  // Google Translate widget loader (top left of title card)
  useEffect(() => {
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit && window.googleTranslateElementInit();
      return;
    }
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,he,ar,ru',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Customer form data
  const [customerInfo, setCustomerInfo] = useState({ name: '', city: '', phone: '' });

  // Quote form configuration
  const [formData, setFormData] = useState({
    showerType: '', model: '', glassType: '', glassThickness: '8',
    hardwareFinish: 'Nickel', height: '', width: '', length: '',
    addOnQuantities: {}, customAddon: '', photo: null
  });

  // Handlers for form updates
  const handleCustomerChange = (field, value) =>
    setCustomerInfo(prev => ({ ...prev, [field]: value }));

  const handleFormChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-4 px-2 lg:px-10 text-[90%]">
            {/* === HEADER / TOP CARD === */}
            <div className="w-full max-w-7xl mx-auto mb-4">
              <div className="bg-white shadow-md rounded-xl flex flex-col md:flex-row items-center justify-between px-4 py-3 relative">
                {/* Google Translate Widget - top left, professional look */}
                <div className="absolute left-1 top-1 z-10 flex items-center max-w-[72px] sm:max-w-none">
                  <span className="text-xs text-gray-500 mr-1 hidden sm:inline">🌐</span>
                  <div id="google_translate_element" className="scale-75 sm:scale-100 origin-top-left" />
                </div>
                {/* Title Card Content */}
                <div className="flex-1 text-center">
                  <h1 className="text-2xl font-bold text-blue-800 mb-1">{t('title') || "Custom Shower Glass Quote Calculator"}</h1>
                  <p className="text-sm text-gray-600">{t('subtitle') || "Get instant pricing for beautiful custom shower enclosures"}</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold shadow"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4M22 4l-10 10" />
                    </svg>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* === MAIN CONTENT AREA === */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* RIGHT COLUMN - NOW FIRST */}
              <div className="flex flex-col gap-4">
                {/* MODEL IMAGE PREVIEW CARD */}
                <div className="bg-white shadow rounded-xl p-4 flex items-center justify-center h-[200px]">
                  {formData.model && modelImages[formData.model] ? (
                    <img
                      src={modelImages[formData.model]}
                      alt={formData.model}
                      className="w-full h-[200px] object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm text-center">No Model Selected</div>
                  )}
                </div>

                {/* QUOTE SUMMARY CARD */}
                <div className="bg-white shadow rounded-xl p-4">
                  <div id="quote-section">
                    <QuoteCalculator customerInfo={customerInfo} formData={formData} />
                  </div>
                </div>
              </div>

              {/* LEFT COLUMN - NOW SECOND */}
              <div className="flex flex-col gap-4">
                {/* CUSTOMER INFO CARD */}
                <div className="bg-white shadow rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">Customer Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: 'Name *', value: customerInfo.name, field: 'name', placeholder: 'Enter your name' },
                      { label: 'City *', value: customerInfo.city, field: 'city', placeholder: 'Enter your city' },
                      { label: 'Phone *', value: customerInfo.phone, field: 'phone', placeholder: 'Enter phone number' }
                    ].map(({ field, value, placeholder }) => (
                      <input
                        key={field}
                        type={field === 'phone' ? 'tel' : 'text'}
                        value={value}
                        onChange={(e) => handleCustomerChange(field, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50"
                        placeholder={placeholder}
                        required
                      />
                    ))}
                  </div>
                </div>

                {/* SHOWER CONFIGURATOR CARD */}
                <div className="bg-white shadow rounded-xl p-4">
                  <ShowerConfigurator
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </div>

                {/* ADD-ONS CARD */}
                <div className="bg-white shadow rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">Add-Ons</h2>
                  <AddOnsSection
                    addOnQuantities={formData.addOnQuantities}
                    onFormChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
          </div>
        } />

        {/* CONTACT PAGE ROUTE */}
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;