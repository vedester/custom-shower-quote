import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from './Admin/api'; // <--- Use your centralized API connector

// Set a default hardware type string for matching in hardware pricing.
const DEFAULT_HARDWARE_TYPE = "Hardware Type 1";

const QuoteCalculator = ({
  customerInfo,
  formData,
  glassTypes,
  glassThicknesses,
  finishes,
  addOns,
  models,
  showerTypes,
  companySettings
}) => {
  const _glassTypes = glassTypes || [];
  const _glassThicknesses = glassThicknesses || [];
  const _finishes = finishes || [];
  const _addOns = addOns || [];
  const _models = models || [];
  const _showerTypes = showerTypes || [];
  const _formData = formData || {};

  const { t } = useTranslation();

  // Pricing data states
  const [glassPricing, setGlassPricing] = useState([]);
  const [hardwarePricing, setHardwarePricing] = useState([]);
  const [addonList, setAddonList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quote calculation states
  const [quote, setQuote] = useState({
    glassPrice: 0,
    hardwarePrice: 0,
    addonsPrice: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    area: 0
  });

  // Debug info for matching process
  const [debugInfo, setDebugInfo] = useState({
    glassMatch: null,
    hardwareMatch: null
  });

  // Fetch pricing data from backend
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        const [glassRes, hardwareRes, addonRes] = await Promise.all([
          api.get('/glass-pricing'),
          api.get('/hardware-pricing'),
          api.get('/addons')
        ]);
        setGlassPricing(Array.isArray(glassRes.data) ? glassRes.data : []);
        setHardwarePricing(Array.isArray(hardwareRes.data) ? hardwareRes.data : []);
        setAddonList(Array.isArray(addonRes.data) ? addonRes.data : []);
      } catch (error) {
        setGlassPricing([]);
        setHardwarePricing([]);
        setAddonList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPricingData();
  }, []);

  useEffect(() => {
    if (loading) return;

    // Area calculation
    const height = parseFloat(_formData.height) || 0;
    const width = parseFloat(_formData.width) || 0;
    const length = parseFloat(_formData.length) || 0;
    let area = 0;
    const selectedShowerType = _showerTypes.find(st => String(st.id) === String(_formData.showerType));
    if (selectedShowerType?.name?.toLowerCase().includes('corner')) {
      area = (height * width) + (height * length);
    } else {
      area = height * width;
    }

    // Selected glass type and thickness (by id)
    const selectedGlassTypeName = _glassTypes.find(gt => String(gt.id) === String(_formData.glassType))?.name;
    const selectedThicknessMM = _glassThicknesses.find(th => String(th.id) === String(_formData.glassThickness))?.thickness_mm;

    // Match glass price
    let glassPrice = 0, glassMatch = null;
    if (selectedGlassTypeName && selectedThicknessMM) {
      const glassPriceObj = glassPricing.find(gp =>
        gp.glass_type === selectedGlassTypeName &&
        Number(gp.thickness_mm) === Number(selectedThicknessMM)
      );
      if (glassPriceObj) {
        glassPrice = (parseFloat(glassPriceObj.price_per_m2) || 0) * area;
        glassMatch = {
          found: true,
          data: glassPriceObj,
          calculation: `${glassPriceObj.price_per_m2} × ${area.toFixed(2)}m² = ${glassPrice.toFixed(2)}`
        };
      } else {
        glassMatch = {
          found: false,
          searchedFor: `${selectedGlassTypeName} ${selectedThicknessMM}mm`
        };
      }
    }

    // Get selected finish (by id)
    const selectedFinishName = _finishes.find(f => String(f.id) === String(_formData.hardwareFinish))?.name;

    // Match hardware price by DEFAULT_HARDWARE_TYPE and finish
    let hardwarePrice = 0, hardwareMatch = null;
    if (selectedFinishName) {
      const hardwarePriceObj = hardwarePricing.find(hp =>
        hp.hardware_type === DEFAULT_HARDWARE_TYPE &&
        hp.finish === selectedFinishName
      );
      if (hardwarePriceObj) {
        hardwarePrice = parseFloat(hardwarePriceObj.unit_price || hardwarePriceObj.price || 0);
        hardwareMatch = {
          found: true,
          data: hardwarePriceObj,
          price: hardwarePrice
        };
      } else {
        hardwareMatch = {
          found: false,
          searchedFor: `${DEFAULT_HARDWARE_TYPE} with ${selectedFinishName} finish`
        };
      }
    }

    // Add-ons price: sum (quantity × price) for each add-on selected
    let addonsPrice = 0;
    if (_formData.addOnQuantities && Object.keys(_formData.addOnQuantities).length > 0) {
      Object.entries(_formData.addOnQuantities).forEach(([addonName, quantity]) => {
        if (quantity > 0) {
          const addonObj = addonList.find(a => a.name === addonName);
          if (addonObj) {
            addonsPrice += (parseFloat(addonObj.price) || 0) * quantity;
          }
        }
      });
    }

    const subtotal = glassPrice + hardwarePrice + addonsPrice;
    const tax = subtotal * 0.17; // 17% VAT
    const total = subtotal + tax;

    setQuote({
      glassPrice,
      hardwarePrice,
      addonsPrice,
      subtotal,
      tax,
      total,
      area
    });

    setDebugInfo({
      glassMatch,
      hardwareMatch
    });
  }, [
    _formData,
    glassPricing,
    hardwarePricing,
    addonList,
    _glassTypes,
    _glassThicknesses,
    _finishes,
    _addOns,
    _models,
    _showerTypes,
    loading
  ]);

  // Get selected option names for display
  const getSelectedOptionName = (options, selectedId) => {
    if (!options) return '--';
    const option = options.find(opt => String(opt.id) === String(selectedId));
    return option?.name || '--';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 border border-blue-100">
      <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
        <span className="mr-2">💰</span>
        {t('Quote Summary') || 'Quote Summary'}
      </h2>

      {/* Customer Information */}
      {customerInfo?.name && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">{t('Customer Information') || 'Customer Information'}</h3>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">{t('Name')}:</span> {customerInfo.name}</p>
            <p><span className="font-medium">{t('City')}:</span> {customerInfo.city}</p>
            <p><span className="font-medium">{t('Phone')}:</span> {customerInfo.phone}</p>
          </div>
        </div>
      )}

      {/* Configuration Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">{t('Configuration') || 'Configuration'}</h3>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">{t('Shower Type')}:</span> {getSelectedOptionName(_showerTypes, _formData.showerType)}</p>
          <p><span className="font-medium">{t('Model')}:</span> {getSelectedOptionName(_models, _formData.model)}</p>
          <p>
            <span className="font-medium">{t('Glass Type')}:</span>{" "}
            {getSelectedOptionName(_glassTypes, _formData.glassType)}{_formData.glassThickness ? ` (${_glassThicknesses.find(th => String(th.id) === String(_formData.glassThickness))?.thickness_mm}mm)` : ''}
          </p>
          <p><span className="font-medium">{t('Hardware Finish')}:</span> {getSelectedOptionName(_finishes, _formData.hardwareFinish)}</p>
          <p><span className="font-medium">{t('Dimensions')}:</span> {_formData.height}m × {_formData.width}m {_formData.length ? `× ${_formData.length}m` : ''}</p>
          {quote.area > 0 && (
            <p><span className="font-medium">{t('Glass Area')}:</span> {quote.area.toFixed(2)} m²</p>
          )}
        </div>
      </div>

      {/* Debug Information */}
      {(debugInfo.glassMatch && !debugInfo.glassMatch.found) || (debugInfo.hardwareMatch && !debugInfo.hardwareMatch.found) ? (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">🔍 Price Matching Status</h4>
          <div className="text-sm space-y-1">
            {debugInfo.glassMatch && !debugInfo.glassMatch.found && (
              <p className="text-red-600">Glass Price Not Found: {debugInfo.glassMatch.searchedFor}</p>
            )}
            {debugInfo.hardwareMatch && !debugInfo.hardwareMatch.found && (
              <p className="text-red-600">Hardware Price Not Found: {debugInfo.hardwareMatch.searchedFor}</p>
            )}
          </div>
        </div>
      ) : null}

      {/* Success Information */}
      {((debugInfo.glassMatch && debugInfo.glassMatch.found) || (debugInfo.hardwareMatch && debugInfo.hardwareMatch.found)) && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">✅ Price Matches Found</h4>
          <div className="text-sm space-y-1">
            {debugInfo.glassMatch && debugInfo.glassMatch.found && (
              <p className="text-green-700">Glass: {debugInfo.glassMatch.calculation}</p>
            )}
            {debugInfo.hardwareMatch && debugInfo.hardwareMatch.found && (
              <p className="text-green-700">Hardware: {formatPrice(debugInfo.hardwareMatch.price)}</p>
            )}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm">{t('Glass Price') || 'Glass Price'}</span>
          <span className={`font-medium ${quote.glassPrice > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {formatPrice(quote.glassPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-sm">{t('Hardware Price') || 'Hardware Price'}</span>
          <span className={`font-medium ${quote.hardwarePrice > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {formatPrice(quote.hardwarePrice)}
          </span>
        </div>
        {quote.addonsPrice > 0 && (
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm">{t('Add-ons Price') || 'Add-ons Price'}</span>
            <span className="font-medium text-blue-600">{formatPrice(quote.addonsPrice)}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2 border-b border-gray-300">
          <span className="font-medium">{t('Subtotal') || 'Subtotal'}</span>
          <span className="font-semibold text-gray-800">{formatPrice(quote.subtotal)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-300">
          <span className="text-sm text-gray-600">{t('VAT (17%)') || 'VAT (17%)'}</span>
          <span className="text-gray-600">{formatPrice(quote.tax)}</span>
        </div>
        <div className="flex justify-between items-center py-3 bg-blue-100 rounded-lg px-3 border-2 border-blue-300">
          <span className="font-bold text-blue-800 text-lg">{t('Total') || 'Total'}</span>
          <span className="font-bold text-blue-800 text-xl">{formatPrice(quote.total)}</span>
        </div>
      </div>

      {/* Status Messages */}
      {quote.total === 0 && !loading && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            {debugInfo.glassMatch?.found === false || debugInfo.hardwareMatch?.found === false
              ? t('Some prices could not be found. Please check your pricing data.') || 'Some prices could not be found. Please check your pricing data.'
              : t('Please complete your selection to see pricing') || 'Please complete your selection to see pricing'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default QuoteCalculator;