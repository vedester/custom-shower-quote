//src/components/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
import Contact from "./pages/Contact";
import './App.css';
import './i18n/i18n';
import { useTranslation } from "react-i18next";

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
};

function App() {
  const { t } = useTranslation();
  const [customerInfo, setCustomerInfo] = useState({ name: '', city: '', phone: '' });
  const [formData, setFormData] = useState({
    showerType: '', model: '', glassType: '', glassThickness: '8',
    hardwareFinish: 'Nickel', height: '', width: '', length: '',
    addOnQuantities: {}, customAddon: '', photo: null
  });

  const handleCustomerChange = (field, value) =>
    setCustomerInfo(prev => ({ ...prev, [field]: value }));

  const handleFormChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-4 px-2 lg:px-10 text-[90%]">
            {/* Header */}
            <div className="w-full max-w-7xl mx-auto mb-4">
              <div className="bg-white shadow-md rounded-xl flex flex-col md:flex-row items-center justify-between px-4 py-3">
                <div className="flex-1 text-center">
                  <h1 className="text-2xl font-bold text-blue-800 mb-1">{t('title')}</h1>
                  <p className="text-sm text-gray-600">{t('subtitle')}</p>
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

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Form */}
              <div className="flex flex-col gap-4">
                {/* Customer Info */}
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

                {/* Shower Configurator */}
                <div className="bg-white shadow rounded-xl p-4">
                  <ShowerConfigurator
                    formData={formData}
                    onFormChange={handleFormChange}
                  />
                </div>

                {/* Add-Ons */}
                <div className="bg-white shadow rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">Add-Ons</h2>
                  <AddOnsSection
                    addOnQuantities={formData.addOnQuantities}
                    onFormChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Right Column: Model Image + Quote Summary */}
              <div className="flex flex-col gap-4">
                {/* Model Image */}
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

                {/* Quote Summary */}
                <div className="bg-white shadow rounded-xl p-4">
                  <div id="quote-section">
                    <QuoteCalculator customerInfo={customerInfo} formData={formData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;