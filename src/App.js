import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuoteCalculator from './components/QuoteCalculator';
import ShowerConfigurator from './components/ShowerConfigurator';
import AddOnsSection from './components/AddOnsSection';
import Contact from "./pages/Contact";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import './App.css';
import './i18n/i18n';
import { useTranslation } from "react-i18next";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-4 px-2 lg:px-10 text-[90%]">
        {/* === HEADER / NAVIGATION BAR === */}
        <header className="w-full max-w-7xl mx-auto mb-8">
          <div className="bg-white shadow-md rounded-xl flex flex-col md:flex-row items-center px-6 py-5 md:py-4 md:px-10">
            {/* NAVIGATION */}
            <nav className="flex items-center flex-wrap gap-2 md:gap-4">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/gallery", label: "Gallery" },
                { to: "/faq", label: "FAQ" }
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-medium text-gray-700 px-3 py-1.5 rounded-md hover:text-blue-700 hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="ml-2 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 10.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-3.8-11.4M22 4l-10 10"
                  />
                </svg>
                Contact Us
              </Link>
            </nav>
            {/* TITLE - CENTERED, always visible */}
            <div className="flex-1 md:ml-10 mt-6 md:mt-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 leading-tight md:text-left text-center tracking-tight">
                {t('title') || "Custom Shower Glass Quote Calculator"}
              </h1>
              <p className="text-base text-gray-600 mt-1 md:text-left text-center">
                {t('subtitle') || "Get instant pricing for beautiful custom shower enclosures"}
              </p>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-6">
                  {/* MODEL IMAGE PREVIEW CARD */}
                  <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center justify-center h-[400px] min-h-[250px] transition-all duration-200">
                    {formData.model && modelImages[formData.model] ? (
                      <img
                        src={modelImages[formData.model]}
                        alt={formData.model}
                        className="w-full h-[350px] object-contain rounded-xl"
                      />
                    ) : (
                      <div className="text-gray-400 text-xl font-medium text-center">No Model Selected</div>
                    )}
                  </div>

                  {/* QUOTE SUMMARY CARD */}
                  <div className="bg-white shadow-lg rounded-2xl p-4">
                    <div id="quote-section">
                      <QuoteCalculator customerInfo={customerInfo} formData={formData} />
                    </div>
                  </div>
                </div>

                {/* LEFT COLUMN */}
                <div className="flex flex-col gap-6">
                  {/* CUSTOMER INFO CARD */}
                  <div className="bg-white shadow-lg rounded-2xl p-2">
                    <h2 className="text-lg font-semibold text-blue-700 mb-2">Customer Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-blue-50 text-base"
                          placeholder={placeholder}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  {/* COMBINED SHOWER CONFIGURATOR & ADD-ONS CARD */}
                  <div className="bg-white shadow-lg rounded-2xl p-2">
                    <h2 className="text-lg font-semibold text-blue-700 mb-0.7">Glass Configuration & Add-Ons</h2>
                    <ShowerConfigurator
                      formData={formData}
                      onFormChange={handleFormChange}
                    />
                    <div className="border-t border-gray-200 my-0.5"></div>
                    <AddOnsSection
                      addOnQuantities={formData.addOnQuantities}
                      onFormChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>
            } />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        {/* Footer could be added here for even more polish */}
      </div>
    </Router>
  );
}

export default App;