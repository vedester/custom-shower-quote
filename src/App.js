import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
import Contact from "./pages/Contact";
import './App.css'; // Optional general styles
import './i18n/i18n'; // i18n config
import { useTranslation } from "react-i18next";
//import { testTranslation } from '../utils/apifyTranslateTest';

// Dictionary for model images
const modelImages = {
  'MTI-101': '/images/models/MTI-101.jpeg',
  'MTI-102': '/images/models/MTI-102.jpg',
  'MTI-103': '/images/models/MTI-103.jpg',
  'MTI-201': '/images/models/MTI-201.jpeg',
  // ... other models ...
};

function App() {
  const { t } = useTranslation();

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
            <div className="w-full max-w-7xl mx-auto mb-8">
              <div className="bg-white shadow-md rounded-xl flex flex-col md:flex-row items-center justify-between px-4 py-3 relative">
                {/* Removed Google Translate Widget */}
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
                <div className="bg-white shadow rounded-xl p-4 flex items-center justify-center h-[400px]">
                  {formData.model && modelImages[formData.model] ? (
                    <img
                      src={modelImages[formData.model]}
                      alt={formData.model}
                      className="w-full h-[400px] object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm text-center">No Model Selected</div>
                  )}
                </div>

                {/* QUOTE SUMMARY CARD */}
                <div className="bg-white shadow rounded-xl p-2">
                  <div id="quote-section">
                    <QuoteCalculator customerInfo={customerInfo} formData={formData} />
                  </div>
                  {/* Always-visible action buttons (example) */}
                  {/* <div className="flex justify-end space-x-2 mt-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
                      disabled={!formData.model}
                    >
                      Save Quote
                    </button>
                    <button
                      className="px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition disabled:opacity-50"
                      disabled={!formData.model}
                    >
                      Print
                    </button>
                  </div> */}
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