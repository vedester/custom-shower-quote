import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
import AdminPanel from './components/AdminPanel';
import Contact from "./pages/Contact";
import './App.css';
import './i18n/i18n';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";


function App() {
  const { t } = useTranslation();

  // Customer info state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    city: '',
    phone: ''
  });

  // Quote form state
  const [formData, setFormData] = useState({
    showerType: '',
    model: '',
    glassType: '',
    glassThickness: '8',
    hardwareFinish: 'Nickel',
    height: '',
    width: '',
    length: '',
    addOnQuantities: {},
    customAddon: '',
    photo: null
  });

  // Admin panel visibility
  const [showAdmin, setShowAdmin] = useState(false);

  // Quote summary visibility
  const [quoteReady, setQuoteReady] = useState(false);

  // State to show/hide the "Back to Top" button
  const [showTopButton, setShowTopButton] = useState(false);

  // Handlers
  const handleCustomerChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  // Show Add to Quote button if all required fields are filled (add-ons are optional)
  const canQuote =
    customerInfo.name &&
    customerInfo.city &&
    customerInfo.phone &&
    formData.showerType &&
    formData.model &&
    formData.glassType &&
    formData.height &&
    formData.width;

  // Show the button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white py-10 px-4">
              <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER */}
                <LanguageSelector />
                <header className="text-center">
                  <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-2">
                    {t('title')}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {t('subtitle')}
                  </p>
                </header>

                {/* CUSTOMER INFORMATION */}
                <section className="bg-white shadow-xl rounded-2xl p-6 space-y-4 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customer Information</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { label: 'Name *', value: customerInfo.name, field: 'name', placeholder: 'Enter your name' },
                      { label: 'City *', value: customerInfo.city, field: 'city', placeholder: 'Enter your city' },
                      { label: 'Phone Number *', value: customerInfo.phone, field: 'phone', placeholder: 'Enter phone number' }
                    ].map(({ label, value, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                          type={field === 'phone' ? 'tel' : 'text'}
                          value={value}
                          onChange={(e) => handleCustomerChange(field, e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder={placeholder}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* SHOWER CONFIGURATOR */}
                <section className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shower Configuration</h2>
                  <ShowerConfigurator
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </section>

                {/* ADD-ONS SECTION */}
                <section className="bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Optional Add-Ons</h2>
                  <AddOnsSection
                    addOnQuantities={formData.addOnQuantities}
                    customAddon={formData.customAddon}
                    onFormChange={handleFormChange}
                  />
                </section>

                {/* ADD TO QUOTE BUTTON */}
                {canQuote && (
                  <div className="text-center mt-4">
                    <button
                      onClick={handleAddToQuote}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition duration-200"
                    >
                      Add to Quote
                    </button>
                  </div>
                )}

                {/* QUOTE SUMMARY */}
                {quoteReady && (
                  <section
                    id="quote-section"
                    className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quote Summary</h2>
                    <QuoteCalculator
                      customerInfo={customerInfo}
                      formData={formData}
                    />
                  </section>
                )}

                {/* ADMIN PANEL BUTTON */}
                <div className="text-center">
                  <button
                    onClick={() => setShowAdmin(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all"
                  >
                    Open Admin Panel
                  </button>
                </div>

                {/* MODAL FOR ADMIN */}
                {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
              </div>
            </div>

            {/* Floating Contact Us Button - always visible */}
            <Link
              to="/contact"
              style={{
                position: 'fixed',
                right: 20,
                bottom: 20,
                zIndex: 9999,
                background: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '9999px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4M22 4l-10 10"></path>
              </svg>
              Contact Us
            </Link>

            {/* Back to Top Button */}
            {showTopButton && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all"
                style={{ zIndex: 9999 }}
              >
                ↑
              </button>
            )}
          </>
        } />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
