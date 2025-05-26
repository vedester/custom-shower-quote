import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
import Contact from "./pages/Contact";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import './App.css';
import './i18n/i18n';
import { useTranslation } from 'react-i18next';

const modelImages = {
  'MTI-101': '/images/models/MTI-101.jpeg',
  'MTI-102': '/images/models/MTI-102.jpg',
  'MTI-103': '/images/models/MTI-103.jpg',
  'MTI-201': '/images/models/MTI-201.jpeg',
};

function App() {
  const { t, i18n } = useTranslation();

  // Set dir=rtl or ltr on <body> for language
  useEffect(() => {
    document.body.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Form State
  const [customerInfo, setCustomerInfo] = useState({ name: '', city: '', phone: '' });
  const [formData, setFormData] = useState({
    showerType: '', model: '', glassType: '', glassThickness: '8',
    hardwareFinish: 'Nickel', height: '', width: '', length: '',
    addOnQuantities: {}, customAddon: '', photo: null
  });

  // Handlers
  const handleCustomerChange = (field, value) =>
    setCustomerInfo(prev => ({ ...prev, [field]: value }));

  const handleFormChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  // Language toggle
  const toggleLanguage = lang => {
    if (lang !== i18n.language) i18n.changeLanguage(lang);
  };

  // Responsive grid order: only swap on EN (LTR), keep right on right for HE (RTL)
  function MainGrid() {
    const isHebrew = i18n.language === 'he';
    return (
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Model + Quote Summary */}
        <div className={`flex flex-col gap-6 ${isHebrew ? 'order-1' : 'order-2 lg:order-1'}`}>
          {/* Model Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px] flex items-center justify-center">
            {formData.model && modelImages[formData.model] ? (
              <img
                src={modelImages[formData.model]}
                alt={formData.model}
                className="h-full object-contain rounded-xl"
              />
            ) : (
              <div className="text-gray-400 text-lg font-semibold text-center">
                {t("No Model Selected")}
              </div>
            )}
          </div>
          {/* Quote Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <QuoteCalculator customerInfo={customerInfo} formData={formData} />
          </div>
        </div>
        {/* RIGHT: Customer Info + Config -- always right, never swaps on RTL */}
        <div className={`flex flex-col gap-6 ${isHebrew ? 'order-2' : 'order-1 lg:order-2'}`}>
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">
              {t("Customer Info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: t('Name *'), field: 'name', placeholder: t('Enter your name') },
                { label: t('City *'), field: 'city', placeholder: t('Enter your city') },
                { label: t('Phone *'), field: 'phone', placeholder: t('Enter phone number') }
              ].map(({ field, placeholder }) => (
                <input
                  key={field}
                  type={field === 'phone' ? 'tel' : 'text'}
                  value={customerInfo[field]}
                  onChange={(e) => handleCustomerChange(field, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={placeholder}
                  required
                />
              ))}
            </div>
          </div>
          {/* Glass Config & Add-ons */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">
              {t("Glass Configuration & Add-Ons")}
            </h2>
            <ShowerConfigurator formData={formData} onFormChange={handleFormChange} />
            <div className="border-t my-6" />
            <AddOnsSection addOnQuantities={formData.addOnQuantities} onFormChange={handleFormChange} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-emerald-100 py-6 px-4 lg:px-12 text-[95%]">
        {/* === HEADER === */}
        <header className="w-full max-w-7xl mx-auto mb-10">
          <div className="bg-white shadow-xl rounded-3xl flex flex-col md:flex-row items-center justify-between px-6 py-4">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  className="w-12 h-12 object-cover rounded-full border-2 border-blue-500"
                />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
                {t("title")}
              </h1>
            </div>

            {/* Nav + Language Toggle */}
            <nav className="flex items-center gap-4 mt-4 md:mt-0">
              {[
                { to: "/", label: t("Home") },
                { to: "/about", label: t("About Us") },
                { to: "/gallery", label: t("Gallery") },
                { to: "/faq", label: t("FAQ") },
                { to: "/contact", label: t("Contact Us") }
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-medium text-gray-700 px-3 py-1.5 rounded-md hover:text-blue-700 hover:bg-blue-100 transition"
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`text-sm px-3 py-1.5 rounded-md transition 
                    ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  aria-label="Switch to English"
                >
                  English
                </button>
                <button
                  onClick={() => toggleLanguage('he')}
                  className={`text-sm px-3 py-1.5 rounded-md transition 
                    ${i18n.language === 'he' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  aria-label="Switch to Hebrew"
                >
                  עברית
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* === MAIN === */}
        <main>
          <Routes>
            <Route path="/" element={<MainGrid />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;