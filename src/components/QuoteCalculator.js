// QuoteCalculator.js
// This component calculates and displays the quote summary for the custom shower glass app.

import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Default settings (used if adminSettings are not set in localStorage)
const defaultSettings = {
  glassTypes: {
    'Clear': 45,
    'Extra Clear': 60,
    'Frosted': 55,
    'Grey': 65,
    'Bronze': 65,
    'Granite': 55,
    'Papita': 60,
    'Stripes': 65,
    'Acid Etched': 70,
    'Artistic Print': 85,
    'Custom Stripes': 75,
    'Galina': 80,
    'Anti-Sun Grey': 90,
    'Anti-Sun Bronze': 95
  },
  hardwareFinish: {
    'Nickel': 50,
    'Black': 150,
    'White': 100,
    'Gold': 200,
    'Graphite': 200,
    'Rose Gold': 300,
    'Matte Gold': 250
  },
  addOns: {
    'Towel Handle': 150,
    'Nano Coating': 200,
    'Custom Notches': 100,
    'Wall Reinforcements': 180,
    'Additional Seals': 80
  },
  addOnsConfig: {
    'Towel Handle': { price: 150, quantity: true },
    'Nano Coating': { price: 200, quantity: true },
    'Custom Notches': { price: 100, quantity: true },
    'Wall Reinforcements': { price: 180, quantity: true },
    'Additional Seals': { price: 80, quantity: true }
  },
  profitMargin: 0.30,
  companyName: 'Your Glass Company',
  companyEmail: 'info@yourcompany.com'
};

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

const QuoteCalculator = ({ customerInfo, formData }) => {
  // Load settings from localStorage or fallback to defaults
  const settings = useMemo(() => {
    const saved = localStorage.getItem('adminSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  }, []);

  const pricing = settings;
  const addOnsConfig = settings.addOnsConfig;

  // Quote state
  const [quote, setQuote] = useState(null);

  // Track add-on quantities (sync with formData)
  const [addOnQuantities, setAddOnQuantities] = useState({
    'Towel Handle': 0,
    'Nano Coating': 0,
    'Custom Notches': 0,
    'Wall Reinforcements': 0,
    'Additional Seals': 0
  });

  // Sync add-on quantities with formData whenever it changes
  useEffect(() => {
    if (formData.addOnQuantities) {
      setAddOnQuantities(prev => ({ ...prev, ...formData.addOnQuantities }));
    }
    // eslint-disable-next-line
  }, [formData.addOnQuantities]);

  // Calculate the quote whenever relevant data changes
  useEffect(() => {
    const calculateQuote = () => {
      // Ensure required fields are present
      if (!formData.height || !formData.width || !formData.glassType) return;

      // Calculate area (special case for Corner showers)
      let area;
      if (formData.showerType === 'Corner') {
        if (!formData.length) return;
        area = (parseFloat(formData.height) * parseFloat(formData.width)) +
               (parseFloat(formData.height) * parseFloat(formData.length));
      } else {
        area = parseFloat(formData.height) * parseFloat(formData.width);
      }

      // Calculate prices
      const glassPrice = pricing.glassTypes[formData.glassType] || 45;
      const basePrice = area * glassPrice;
      const hardwarePrice = pricing.hardwareFinish[formData.hardwareFinish] || 0;

      // Calculate add-ons cost
      let addOnsCost = 0;
      Object.entries(addOnQuantities).forEach(([addon, qty]) => {
        if (qty > 0) {
          addOnsCost += (addOnsConfig[addon]?.price || 0) * qty;
        }
      });

      const subtotal = basePrice + hardwarePrice + addOnsCost;
      const finalPrice = subtotal * (1 + (pricing.profitMargin || 0.3));

      setQuote({
        area: area.toFixed(2),
        basePrice: basePrice.toFixed(2),
        hardwarePrice,
        addOnsCost,
        subtotal: subtotal.toFixed(2),
        finalPrice: finalPrice.toFixed(2)
      });
    };

    calculateQuote();
  }, [formData, addOnQuantities, pricing, addOnsConfig]);

  // --- PDF GENERATION ---
  const generateQuoteText = () => {
    const allAddOns = Object.entries(addOnQuantities)
      .filter(([addon, qty]) => qty > 0)
      .map(([addon, qty]) =>
        addOnsConfig[addon]?.quantity ? `${addon} (x${qty})` : addon
      );
    if (formData.customAddon) allAddOns.push(formData.customAddon);

    return `
SHOWER GLASS QUOTE
==================

Customer Information:
Name: ${customerInfo.name}
City: ${customerInfo.city}
Phone: ${customerInfo.phone}

Project Details:
Shower Type: ${formData.showerType}
Model: ${formData.model}
Glass Type: ${formData.glassType}
Glass Thickness: ${formData.glassThickness}mm
Hardware Finish: ${formData.hardwareFinish}

Dimensions:
Height: ${formData.height}m
Width: ${formData.width}m
${formData.showerType === 'Corner' ? `Length: ${formData.length}m` : ''}

Add-ons: ${allAddOns.length > 0 ? allAddOns.join(', ') : 'None'}

PRICING BREAKDOWN:
Area: ${quote?.area} m²
Base Price: $${quote?.basePrice}
Hardware: $${quote?.hardwarePrice}
Add-ons: $${quote?.addOnsCost}
Subtotal: $${quote?.subtotal}
Final Price: $${quote?.finalPrice}

Generated on: ${new Date().toLocaleDateString()}
Company: ${settings.companyName}
Contact: ${settings.companyEmail}
    `.trim();
  };

  // Helper to load image as base64
  const getImageBase64 = (url) =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 1.0));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  // Download the quote as a PDF file (with image)
  const downloadQuote = async () => {
    const doc = new jsPDF();
    let y = 10;

    // Add model image if available
    if (formData.model && modelImages[formData.model]) {
      const imgData = await getImageBase64(modelImages[formData.model]);
      if (imgData) {
        doc.addImage(imgData, 'JPEG', 10, y, 50, 40);
        y += 45;
      }
    }

    // Add quote text
    const lines = doc.splitTextToSize(generateQuoteText(), 180);
    doc.text(lines, 10, y);

    doc.save(`quote-${customerInfo.name || 'customer'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // WhatsApp and Email: prompt user to download PDF, as direct file sending is not possible from browser
  const shareWhatsApp = () => {
    alert('Please download the PDF and attach it manually in WhatsApp.');
  };

  const shareEmail = () => {
    alert('Please download the PDF and attach it manually to your email.');
  };

  // Send quote details to store owner via email
  const sendToStoreOwner = () => {
    const storeEmail = settings.companyEmail;
    const subject = encodeURIComponent('New Quote Request - ' + customerInfo.name);
    const body = encodeURIComponent(`
New quote request received:

${generateQuoteText()}

Customer Photo: ${formData.photo ? 'Attached' : 'Not provided'}
    `);

    window.open(`mailto:${storeEmail}?subject=${subject}&body=${body}`, '_blank');
    alert('Quote details sent to store! We will contact you soon.');
  };

  // Render the add-ons summary list
  const renderAddOnsSummary = () => {
    const selectedAddOns = Object.entries(addOnQuantities)
      .filter(([addon, qty]) => qty > 0)
      .map(([addon, qty]) => (
        <li key={addon} className="flex items-center text-sm">
          <span className="font-medium">{addon}</span>
          <span className="ml-1 text-gray-600">(+${addOnsConfig[addon]?.price || 0})</span>
          {addOnsConfig[addon]?.quantity && (
            <span className="ml-1 text-blue-600 font-semibold">x{qty}</span>
          )}
        </li>
      ));

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Optional Add-ons</label>
        <ul className="list-disc list-inside space-y-1 ml-3">
          {selectedAddOns}
          {formData.customAddon && (
            <li className="text-sm">
              <span className="font-medium">{formData.customAddon}</span>
            </li>
          )}
          {selectedAddOns.length === 0 && !formData.customAddon && (
            <li className="text-gray-400 text-sm">None selected</li>
          )}
        </ul>
      </div>
    );
  };

  // Main render for the quote summary UI
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Quote Summary</h2>

      {/* Add-ons summary */}
      {renderAddOnsSummary()}

      {/* Show quote breakdown if quote is calculated */}
      {quote ? (
        <div className="space-y-4">
          {/* Pricing breakdown */}
          <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="font-semibold">Area:</span>
              <span className="font-medium">{quote.area} m²</span>
              <span className="font-semibold">Base Price:</span>
              <span className="font-medium">${quote.basePrice}</span>
              <span className="font-semibold">Hardware:</span>
              <span className="font-medium">${quote.hardwarePrice}</span>
              <span className="font-semibold">Add-ons:</span>
              <span className="font-medium">${quote.addOnsCost}</span>
              <span className="font-semibold">Subtotal:</span>
              <span className="font-medium">${quote.subtotal}</span>
            </div>
          </div>

          {/* Final price display */}
          <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300 shadow-inner">
            <div className="text-center">
              <div className="text-sm text-gray-600">Final Price</div>
              <div className="text-3xl font-bold text-green-700">${quote.finalPrice}</div>
              <div className="text-xs text-gray-500 mt-1">
                Including {Math.round((settings.profitMargin || 0.3) * 100)}% profit margin
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadQuote}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send via WhatsApp
            </button>
            <button
              onClick={shareEmail}
              className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send via Email
            </button>
            <button
              onClick={sendToStoreOwner}
              className="flex items-center justify-center px-4 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Send to Store Owner
            </button>
          </div>
          <button
            disabled
            className="w-full flex items-center justify-center px-4 py-3 bg-yellow-500 text-white rounded-md opacity-75 cursor-not-allowed font-semibold mt-2"
          >
            💳 Pay Now (Coming Soon)
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>Fill in the details to see your quote</p>
        </div>
      )}
    </div>
  );
};

export default QuoteCalculator;