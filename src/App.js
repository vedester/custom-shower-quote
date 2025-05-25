import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
// import AdminPanel from './components/AdminPanel';
import Contact from "./pages/Contact";
import './App.css';
import './i18n/i18n';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";
// import UploadSection from './components/UploadSection';
// import PreviewSection from './components/PreviewSection';

function App() {
  const { t } = useTranslation();
  const [customerInfo, setCustomerInfo] = useState({ name: '', city: '', phone: '' });
  const [formData, setFormData] = useState({
    showerType: '', model: '', glassType: '', glassThickness: '8',
    hardwareFinish: 'Nickel', height: '', width: '', length: '',
    addOnQuantities: {}, customAddon: '', photo: null
  });
  // const [showAdmin, setShowAdmin] = useState(false);
  const [quoteReady, setQuoteReady] = useState(false);

  const handleCustomerChange = (field, value) =>
    setCustomerInfo(prev => ({ ...prev, [field]: value }));

  const handleFormChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleAddToQuote = () => {
    if (!customerInfo.name || !customerInfo.city || !customerInfo.phone) {
      alert('Please fill in customer details.');
      return;
    }
    if (!formData.showerType || !formData.model || !formData.glassType || !formData.height || !formData.width) {
      alert('Please complete the shower configuration.');
      return;
    }
    setQuoteReady(true);
    document.getElementById('quote-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const canQuote = customerInfo.name && customerInfo.city && customerInfo.phone &&
                   formData.showerType && formData.model && formData.glassType &&
                   formData.height && formData.width;

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex flex-col">
            {/* Language Selector Top Left */}
            <div className="w-full flex justify-start px-2 pt-2 pb-0">
              <LanguageSelector />
            </div>
            {/* Header */}
            <div className="flex flex-col items-center justify-center px-2 pt-0 pb-0">
              <h1 className="text-lg lg:text-xl font-extrabold text-blue-800 tracking-tight drop-shadow mb-0 text-center">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-[11px] lg:text-xs text-center">{t('subtitle')}</p>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 px-1 pb-1 max-h-[calc(100vh-70px)]">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-1 max-h-full">
                {/* Customer Info */}
                <section className="bg-white/90 shadow rounded-xl p-2 border border-blue-100">
                  <h2 className="text-[12px] font-bold text-blue-700 mb-1">Customer Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    {[
                      { label: 'Name *', value: customerInfo.name, field: 'name', placeholder: 'Enter your name' },
                      { label: 'City *', value: customerInfo.city, field: 'city', placeholder: 'Enter your city' },
                      { label: 'Phone *', value: customerInfo.phone, field: 'phone', placeholder: 'Enter phone number' }
                    ].map(({ label, value, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">{label}</label>
                        <input
                          type={field === 'phone' ? 'tel' : 'text'}
                          value={value}
                          onChange={(e) => handleCustomerChange(field, e.target.value)}
                          className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50/40 text-[10px]"
                          placeholder={placeholder}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Quote Summary */}
                <section className="bg-white/95 shadow rounded-xl p-2 border border-emerald-100 flex flex-col min-h-[100px]">
                  {canQuote && (
                    <button
                      onClick={handleAddToQuote}
                      className="w-full mb-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold rounded shadow text-[11px]"
                    >
                      Add to Quote
                    </button>
                  )}
                  {quoteReady && (
                    <div id="quote-section" className="mt-1">
                      <h2 className="text-[12px] font-bold text-emerald-700 mb-1">Quote Summary</h2>
                      <QuoteCalculator
                        customerInfo={customerInfo}
                        formData={formData}
                      />
                    </div>
                  )}
                  {/* 
                  <button
                    onClick={() => setShowAdmin(true)}
                    className="w-full mt-1 px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow hover:from-blue-700 hover:to-blue-600 text-xs"
                  >
                    Open Admin Panel
                  </button>
                  {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
                  */}
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-1 max-h-full">
                {/* Shower Configurator */}
                <section className="bg-white/90 shadow rounded-xl p-2 border border-blue-100 flex-1">
                  <h2 className="text-[12px] font-bold text-blue-700 mb-1">Shower Config</h2>
                  <div className="space-y-1 text-[10px]">
                    <ShowerConfigurator
                      formData={formData}
                      onFormChange={handleFormChange}
                      compact
                    />
                  </div>
                </section>

                {/* Add-Ons */}
                <section className="bg-white/90 shadow rounded-xl p-1 border border-blue-100 min-h-[40px]">
                  <h2 className="text-[12px] font-bold text-blue-700 mb-1">Add-Ons</h2>
                  <div className="overflow-x-auto">
                    <div className="flex gap-1 text-[10px]">
                      <AddOnsSection
                        addOnQuantities={formData.addOnQuantities}
                        // customAddon={formData.customAddon}
                        onFormChange={handleFormChange}
                        compact
                        cardClassName="w-[110px] min-w-[110px] p-1 flex flex-col items-center justify-between"
                        nameClassName="text-[10px] font-bold text-center"
                        priceClassName="text-[9px] text-gray-500"
                        buttonClassName="px-2 py-1 text-[10px]"
                      />
                    </div>
                  </div>
                </section>

                {/* Upload Section (optional) */}
                {/*
                <section className="bg-white/90 shadow rounded-xl p-2 border border-blue-100 flex-1">
                  <h2 className="text-xs font-bold text-blue-700 mb-1">Upload Shower Photo (Optional)</h2>
                  <UploadSection
                    photo={formData.photo}
                    onFormChange={handleFormChange}
                  />
                </section>
                */}

                {/* Preview Section (optional) */}
                {/*
                <section className="bg-white/90 shadow rounded-xl p-2 border border-blue-100 flex-1">
                  <h2 className="text-xs font-bold text-blue-700 mb-1">Preview</h2>
                  <PreviewSection
                    formData={formData}
                  />
                </section>
                */}

                {/* Other custom add-ons (optional) */}
                {/*
                <section className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100 mt-2">
                  <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Other custom add-ons (optional)</h4>
                  <input
                    type="text"
                    value={formData.customAddon || ''}
                    onChange={e => handleFormChange('customAddon', e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="Enter your custom add-on"
                  />
                </section>
                */}
              </div>
            </div>

            {/* Contact Us Floating Button */}
            <Link
              to="/contact"
              className="fixed right-2 bottom-2 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-xl font-bold flex items-center gap-2 transition-all text-xs"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4M22 4l-10 10"></path>
              </svg>
              Contact Us
            </Link>
          </div>
        } />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
