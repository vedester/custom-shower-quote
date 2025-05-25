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
// import LanguageSelector from "./components/LanguageSelector";
// import UploadSection from './components/UploadSection';
// import PreviewSection from './components/PreviewSection';

const modelImages = {
  'MTI-101': '/images/models/MTI-101.jpeg',
  'MTI-102': '/images/models/MTI-102.jpg',
  'MTI-103': '/images/models/MTI-103.jpg',
  'MTI-201': '/images/models/MTI-201.jpeg',
  'MTI-202': '/images/models/MTI-202.jpg',
  'MTI-203': '/images/models/MTI-203.jpg',
  'MTI-301': '/images/models/MTI-301.jpg',
  'MTI-302': '/images/models/MTI-302.jpg',
  'MTI-401': '/images/models/MTI-401.jpg',
  'MTI-402': '/images/models/MTI-402.jpg',
  'MTI-501': '/images/models/MTI-501.jpg',
  'MTI-502': '/images/models/MTI-502.jpg',
  'MTI-601': '/images/models/MTI-601.jpg',
  'MTI-602': '/images/models/MTI-602.jpg',
  // Add more as needed
};

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
            {/* Header Card */}
            <div className="w-full max-w-none flex justify-center mt-4 mb-2">
              <div className="bg-white/95 shadow-lg rounded-xl border border-blue-100 flex flex-row items-center px-4 py-2 w-full">
                {/* Left Spacer */}
                <div className="flex-1"></div>
                {/* Centered Title/Subitle */}
                <div className="flex flex-col items-center flex-none">
                  <h1 className="text-2xl font-extrabold text-blue-800 tracking-tight drop-shadow text-center mb-0">
                    {t('title')}
                  </h1>
                  <p className="text-gray-500 text-base text-center">{t('subtitle')}</p>
                </div>
                {/* Contact Us Button on the right */}
                <div className="flex-1 flex justify-end">
                  <Link
                    to="/contact"
                    className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow text-xs font-bold transition ml-2"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4M22 4l-10 10"></path>
                    </svg>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-1 px-1 pb-1 max-h-[calc(100vh-70px)]">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-1 max-h-full">
                {/* Model Image Card */}
                {formData.model && modelImages[formData.model] && (
                  <section className="bg-white/95 shadow rounded-xl p-1 border border-blue-100 flex flex-col items-center min-h-[80px]">
                    <img
                      src={modelImages[formData.model]}
                      alt={formData.model}
                      className="w-full max-w-[180px] h-auto rounded mb-1 object-contain"
                      style={{ maxHeight: '100px' }}
                    />
                    <span className="text-[11px] text-gray-700 font-semibold">{formData.model}</span>
                  </section>
                )}

                {/* Quote Summary */}
                <section className="bg-white/95 shadow rounded-xl p-1 border border-emerald-100 flex flex-col min-h-[60px]">
                  <button
                    onClick={handleAddToQuote}
                    className="w-full mb-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold rounded shadow text-xs"
                  >
                    Add to Quote
                  </button>
                  <div id="quote-section" className="mt-1">
                    <h2 className="text-xs font-bold text-emerald-700 mb-1">Quote Summary</h2>
                    <QuoteCalculator
                      customerInfo={customerInfo}
                      formData={formData}
                    />
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-1 max-h-full">
                {/* Customer Info Card - now on top of right column */}
                <section className="bg-white/90 shadow rounded-xl p-1 border border-blue-100 min-h-[30px]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-xs">
                    {[
                      { label: 'Name *', value: customerInfo.name, field: 'name', placeholder: 'Enter your name' },
                      { label: 'City *', value: customerInfo.city, field: 'city', placeholder: 'Enter your city' },
                      { label: 'Phone *', value: customerInfo.phone, field: 'phone', placeholder: 'Enter phone number' }
                    ].map(({ label, value, field, placeholder }) => (
                      <input
                        key={field}
                        type={field === 'phone' ? 'tel' : 'text'}
                        value={value}
                        onChange={(e) => handleCustomerChange(field, e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50/40 text-xs"
                        placeholder={placeholder}
                        required
                      />
                    ))}
                  </div>
                </section>

                {/* Shower Configurator */}
                <section className="bg-white/90 shadow rounded-xl p-1 border border-blue-100 flex-1">
                  <div className="space-y-0.5 text-xs">
                    <ShowerConfigurator
                      formData={formData}
                      onFormChange={handleFormChange}
                    />
                  </div>
                </section>

                {/* Add-Ons */}
                <section className="bg-white/90 shadow rounded-xl p-1 border border-blue-100 min-h-[30px]">
                  <h2 className="text-xs font-bold text-blue-700 mb-1">Add-Ons</h2>
                  <div className="overflow-x-auto">
                    <div className="flex gap-1 text-xs">
                      <AddOnsSection
                        addOnQuantities={formData.addOnQuantities}
                        onFormChange={handleFormChange}
                        compact
                        cardClassName="w-[90px] min-w-[90px] p-1 flex flex-col items-center justify-between"
                        nameClassName="text-[10px] font-bold text-center"
                        priceClassName="text-[9px] text-gray-500"
                        buttonClassName="px-2 py-1 text-[10px]"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Customer Card (minimal, no Customer Info) */}
            <section className="bg-white/90 shadow rounded-xl p-1 border border-blue-100 min-h-[20px]"></section>

            {/* Contact Us Floating Button
            <Link
              to="/contact"
              className="fixed right-2 bottom-2 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-xl font-bold flex items-center gap-2 transition-all text-xs"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4M22 4l-10 10"></path>
              </svg>
              Contact Us
            </Link> */}
          </div>
        } />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
