import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from './Admin/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DEFAULT_HARDWARE_TYPE = "Hardware Type 1";

// --- Model selection logic exactly matching ShowerConfigurator ---
function getPreviewModel({ models, formData }) {
  const filteredModels = models.filter(
    (m) => String(m.shower_type_id) === String(formData.showerType)
  );
  const selectedModel =
    filteredModels.find((m) => String(m.id) === String(formData.model)) ||
    models.find((m) => String(m.id) === String(formData.model));
  const modelImageUrl = selectedModel?.image_path
    ? selectedModel.image_path.startsWith('http')
      ? selectedModel.image_path
      : `/images/models/${selectedModel.image_path}`
    : null;
  return { selectedModel, modelImageUrl };
}

const QuoteCalculator = ({
  customerInfo,
  formData,
  glassTypes,
  glassThicknesses,
  finishes,
  addOns,
  models,
  showerTypes,
  companySettings,
  sealTypes,
}) => {
  const _glassTypes = glassTypes || [];
  const _glassThicknesses = glassThicknesses || [];
  const _finishes = finishes || [];
  const _addOns = addOns || [];
  const _models = models || [];
  const _showerTypes = showerTypes || [];
  const _sealTypes = sealTypes || [];
  const _formData = formData || {};

  const { t } = useTranslation();

  // Pricing data states
  const [glassPricing, setGlassPricing] = useState([]);
  const [hardwarePricing, setHardwarePricing] = useState([]);
  const [addonList, setAddonList] = useState([]);
  const [sealPricing, setSealPricing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quote calculation states
  const [quote, setQuote] = useState({
    glassPrice: 0,
    hardwarePrice: 0,
    sealsPrice: 0,
    addonsPrice: 0,
    subtotal: 0,
    vat: 0,
    profit: 0,
    total: 0,
    area: 0,
  });

  // Debug info for matching process
  const [debugInfo, setDebugInfo] = useState({
    glassMatch: null,
    hardwareMatch: null,
    sealsMatch: [],
  });

  // For image loading into PDF
  const [modelImageLoaded, setModelImageLoaded] = useState(false);

  const pdfRef = useRef();

  // Fetch pricing data from backend
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        const [glassRes, hardwareRes, addonRes, sealRes] = await Promise.all([
          api.get('/glass-pricing'),
          api.get('/hardware-pricing'),
          api.get('/addons'),
          api.get('/seal-pricing'),
        ]);
        setGlassPricing(Array.isArray(glassRes.data) ? glassRes.data : []);
        setHardwarePricing(Array.isArray(hardwareRes.data) ? hardwareRes.data : []);
        setAddonList(Array.isArray(addonRes.data) ? addonRes.data : []);
        setSealPricing(Array.isArray(sealRes.data) ? sealRes.data : []);
      } catch (error) {
        setGlassPricing([]);
        setHardwarePricing([]);
        setAddonList([]);
        setSealPricing([]);
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
    const selectedShowerType = _showerTypes.find(
      (st) => String(st.id) === String(_formData.showerType)
    );
    if (selectedShowerType?.name?.toLowerCase().includes('corner')) {
      area = height * width + height * length;
    } else {
      area = height * width;
    }

    // Selected glass type and thickness (by id)
    const selectedGlassTypeName = _glassTypes.find(
      (gt) => String(gt.id) === String(_formData.glassType)
    )?.name;
    const selectedThicknessMM = _glassThicknesses.find(
      (th) => String(th.id) === String(_formData.glassThickness)
    )?.thickness_mm;

    // Match glass price
    let glassPrice = 0,
      glassMatch = null;
    if (selectedGlassTypeName && selectedThicknessMM) {
      const glassPriceObj = glassPricing.find(
        (gp) =>
          gp.glass_type === selectedGlassTypeName &&
          Number(gp.thickness_mm) === Number(selectedThicknessMM)
      );
      if (glassPriceObj) {
        glassPrice = (parseFloat(glassPriceObj.price_per_m2) || 0) * area;
        glassMatch = {
          found: true,
          data: glassPriceObj,
          calculation: `${glassPriceObj.price_per_m2} × ${area.toFixed(2)}m² = ₪${glassPrice.toFixed(2)}`,
        };
      } else {
        glassMatch = {
          found: false,
          searchedFor: `${selectedGlassTypeName} ${selectedThicknessMM}mm`,
        };
      }
    }

    // Get selected finish (by id)
    const selectedFinishName = _finishes.find(
      (f) => String(f.id) === String(_formData.hardwareFinish)
    )?.name;

    // Match hardware price by DEFAULT_HARDWARE_TYPE and finish
    let hardwarePrice = 0,
      hardwareMatch = null;
    if (selectedFinishName) {
      const hardwarePriceObj = hardwarePricing.find(
        (hp) =>
          hp.hardware_type === DEFAULT_HARDWARE_TYPE && hp.finish === selectedFinishName
      );
      if (hardwarePriceObj) {
        const quantity = Number(_formData.hardwareQuantity) || hardwarePriceObj.quantity || 1;
        hardwarePrice =
          (parseFloat(hardwarePriceObj.unit_price || hardwarePriceObj.price || 0)) *
          quantity;
        hardwareMatch = {
          found: true,
          data: hardwarePriceObj,
          price: hardwarePrice,
          quantity,
        };
      } else {
        hardwareMatch = {
          found: false,
          searchedFor: `${DEFAULT_HARDWARE_TYPE} with ${selectedFinishName} finish`,
        };
      }
    }

    // --- SEALS LOGIC (single seal selection, always quantity=1 for quote) ---
    let sealsPrice = 0;
    let sealsMatch = [];
    if (_formData.sealType) {
      const sealObj = sealPricing.find((s) => String(s.seal_type_id) === String(_formData.sealType));
      if (sealObj) {
        const price = parseFloat(sealObj.unit_price) || 0;
        sealsPrice = price; // always 1 for quote
        sealsMatch.push({
          found: true,
          sealType: _sealTypes.find((st) => String(st.id) === String(_formData.sealType))?.name || _formData.sealType,
          unit_price: sealObj.unit_price,
          quantity: 1,
          price,
        });
      } else {
        sealsMatch.push({
          found: false,
          sealType: _sealTypes.find((st) => String(st.id) === String(_formData.sealType))?.name || _formData.sealType,
          quantity: 1,
        });
      }
    }

    // Add-ons price: sum (quantity × price) for each add-on selected
    let addonsPrice = 0;
    if (_formData.addOnQuantities && Object.keys(_formData.addOnQuantities).length > 0) {
      Object.entries(_formData.addOnQuantities).forEach(([addonName, quantity]) => {
        if (quantity > 0) {
          const addonObj = addonList.find((a) => a.name === addonName);
          if (addonObj) {
            addonsPrice += (parseFloat(addonObj.price) || 0) * quantity;
          }
        }
      });
    }

    // Pricing formula
    const subtotal = glassPrice + hardwarePrice + sealsPrice + addonsPrice;
    const vat = subtotal * 0.18;
    const profitMarginPercent = Number(companySettings?.profitMarginPercent) || 20;
    const profit = (subtotal + vat) * (profitMarginPercent / 100);
    const total = subtotal + vat + profit;

    setQuote({
      glassPrice,
      hardwarePrice,
      sealsPrice,
      addonsPrice,
      subtotal,
      vat,
      profit,
      total,
      area,
    });

    setDebugInfo({
      glassMatch,
      hardwareMatch,
      sealsMatch,
    });
  }, [
    _formData,
    glassPricing,
    hardwarePricing,
    addonList,
    sealPricing,
    _glassTypes,
    _glassThicknesses,
    _finishes,
    _addOns,
    _models,
    _showerTypes,
    _sealTypes,
    loading,
    companySettings,
  ]);

  // Get selected option names for display
  const getSelectedOptionName = (options, selectedId) => {
    if (!options) return '--';
    const option = options.find((opt) => String(opt.id) === String(selectedId));
    return option?.name || '--';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // --- SEAL SELECTION LIST DISPLAY ---
  const selectedSealsList = _formData.sealType
    ? [[_formData.sealType, 1]]
    : [];

  // --- Model Preview image, matched to ShowerConfigurator ---
  const { selectedModel, modelImageUrl } = getPreviewModel({ models: _models, formData: _formData });

  // Preload model image for PDF export
  useEffect(() => {
    if (!modelImageUrl) { setModelImageLoaded(true); return; }
    setModelImageLoaded(false);
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = modelImageUrl;
    img.onload = () => setModelImageLoaded(true);
    img.onerror = () => setModelImageLoaded(true); // allow PDF even if failed
  }, [modelImageUrl]);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    if (modelImageUrl && !modelImageLoaded) {
      alert("Please wait, the model image is still loading...");
      return;
    }
    const pdfInput = document.getElementById('full-pdf-content');
    if (!pdfInput) return;
    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) downloadBtn.style.display = 'none';

    await html2canvas(pdfInput, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save('quote-summary.pdf');
    });

    setTimeout(() => {
      if (downloadBtn) downloadBtn.style.display = '';
    }, 500);
  };

  // --- CUSTOMER FINAL OUTPUT: Only Display Final Price Card (NO model image preview) ---
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "40vh",
      width: "100%"
    }}>
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          background: "#dbeafe",
          borderRadius: "1.5rem",
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.07), 0 2px 4px rgba(30, 64, 175, 0.09)",
          padding: 32,
          border: "1px solid #bfdbfe"
        }}
        ref={pdfRef}
      >
        <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              textAlign: "center",
              color: "#1e3a8a",
              marginBottom: 16
            }}>
          {t('Final Quote') || 'Final Quote'}
        </h2>
        {/* NO model image preview here! */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <span style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 8
          }}>
            {t('Total Price')}:
          </span>
          <span style={{
            fontSize: 40,
            fontWeight: 800,
            color: "#1e3a8a",
            letterSpacing: "0.09em",
            marginBottom: 16
          }}>
            {formatPrice(quote.total)}
          </span>
        </div>
        <div style={{
          textAlign: "center",
          color: "#374151",
          marginBottom: 24,
          marginTop: 8
        }}>
          {t('Includes all materials, VAT (18%), and profit margin')}
        </div>
        <button
          id="download-pdf-btn"
          type="button"
          onClick={handleDownloadPDF}
          disabled={!!modelImageUrl && !modelImageLoaded}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: "0.75rem",
            background: modelImageUrl && !modelImageLoaded ? "#a5b4fc" : "#2563eb",
            color: "#fff",
            fontWeight: 700,
            fontSize: 20,
            marginTop: 8,
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.19)",
            cursor: modelImageUrl && !modelImageLoaded ? "not-allowed" : "pointer"
          }}
        >
          {modelImageUrl && !modelImageLoaded
            ? t('Loading image...')
            : (t('Download Full Quote PDF') || 'Download Full Quote PDF')}
        </button>
      </div>

      {/* --- Hidden PDF Content (for export only) --- */}
      <div
        style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px', zIndex: -1 }}
        aria-hidden="true"
      >
        <div style={{
          background: "#fff",
          boxShadow: "0 10px 25px rgba(30, 64, 175, 0.07), 0 2px 4px rgba(30, 64, 175, 0.09)",
          borderRadius: "1.5rem",
          padding: 32
        }} id="full-pdf-content">
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1e3a8a",
            marginBottom: 16,
            textAlign: "center"
          }}>
            {t('Quote Summary')}
          </h2>
          {modelImageUrl && modelImageLoaded && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <img
                src={modelImageUrl}
                alt={selectedModel?.name || 'Model'}
                style={{
                  height: 176,
                  width: "auto",
                  objectFit: "contain",
                  borderRadius: "1rem",
                  border: "1px solid #d1d5db",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
                }}
                crossOrigin="anonymous"
              />
            </div>
          )}
          {/* --- Customer Info --- */}
          {customerInfo?.name && (
            <div style={{
              marginBottom: 16,
              padding: 12,
              background: "#e0e7ff",
              borderRadius: "0.75rem",
              border: "1px solid #bfdbfe"
            }}>
              <h3 style={{
                fontWeight: 600,
                color: "#2563eb",
                marginBottom: 8
              }}>
                {t('Customer Information') || 'Customer Information'}
              </h3>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <p><span style={{ fontWeight: 500 }}>{t('Name')}:</span> {customerInfo.name}</p>
                <p><span style={{ fontWeight: 500 }}>{t('City')}:</span> {customerInfo.city}</p>
                <p><span style={{ fontWeight: 500 }}>{t('Phone')}:</span> {customerInfo.phone}</p>
              </div>
            </div>
          )}

          {/* --- Configuration Summary --- */}
          <div style={{
            marginBottom: 16,
            padding: 12,
            background: "#f3f4f6",
            borderRadius: "0.75rem"
          }}>
            <h3 style={{
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8
            }}>{t('Configuration') || 'Configuration'}</h3>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              <p>
                <span style={{ fontWeight: 500 }}>{t('Shower Type')}:</span>{' '}
                {getSelectedOptionName(_showerTypes, _formData.showerType)}
              </p>
              <p>
                <span style={{ fontWeight: 500 }}>{t('Model')}:</span>{' '}
                {getSelectedOptionName(_models, _formData.model)}
              </p>
              <p>
                <span style={{ fontWeight: 500 }}>{t('Glass Type')}:</span>{' '}
                {getSelectedOptionName(_glassTypes, _formData.glassType)}
                {_formData.glassThickness
                  ? ` (${_glassThicknesses.find((th) => String(th.id) === String(_formData.glassThickness))?.thickness_mm}mm)`
                  : ''}
              </p>
              <p>
                <span style={{ fontWeight: 500 }}>{t('Hardware Finish')}:</span>{' '}
                {getSelectedOptionName(_finishes, _formData.hardwareFinish)}
              </p>
              <p>
                <span style={{ fontWeight: 500 }}>{t('Dimensions')}:</span>{' '}
                {_formData.height}m × {_formData.width}m {_formData.length ? `× ${_formData.length}m` : ''}
              </p>
              {quote.area > 0 && (
                <p>
                  <span style={{ fontWeight: 500 }}>{t('Glass Area')}:</span> {quote.area.toFixed(2)} m²
                </p>
              )}
              {/* --- Short Seals Presentation --- */}
{debugInfo.sealsMatch && debugInfo.sealsMatch.length > 0 && debugInfo.sealsMatch.some(sm => sm.found) && (
  <p>
    <span style={{ fontWeight: 500 }}>{t('Seals')}:</span>{' '}
    {debugInfo.sealsMatch
      .filter(sm => sm.found)
      .map((sm) =>
        `${sm.sealType} (${sm.quantity}) — ${formatPrice(sm.price)}`
      )
      .join(', ')
    }
  </p>
)}
            </div>
          </div>

          {/* --- Price Matches --- */}
          {(debugInfo.glassMatch && debugInfo.glassMatch.found) ||
          (debugInfo.hardwareMatch && debugInfo.hardwareMatch.found) ||
          debugInfo.sealsMatch.some((sm) => sm.found) ? (
            <div style={{
              marginBottom: 16,
              padding: 12,
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              borderRadius: "0.75rem"
            }}>
              <h4 style={{
                fontWeight: 600,
                color: "#16a34a",
                marginBottom: 8
              }}>✅ {t('Price Matches Found')}</h4>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                {debugInfo.glassMatch && debugInfo.glassMatch.found && (
                  <p style={{ color: "#15803d" }}>
                    {t('Glass')}: {debugInfo.glassMatch.calculation}
                  </p>
                )}
                {debugInfo.hardwareMatch && debugInfo.hardwareMatch.found && (
                  <p style={{ color: "#15803d" }}>
                    {t('Hardware')}: {formatPrice(debugInfo.hardwareMatch.price)} (qty: {debugInfo.hardwareMatch.quantity})
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {/* Price Breakdown */}
          <div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <span style={{ fontSize: 14 }}>{t('Glass Price') || 'Glass Price'}</span>
              <span style={{
                fontWeight: 500,
                color: quote.glassPrice > 0 ? "#059669" : "#dc2626"
              }}>
                {formatPrice(quote.glassPrice)}
              </span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <span style={{ fontSize: 14 }}>{t('Hardware Price') || 'Hardware Price'}</span>
              <span style={{
                fontWeight: 500,
                color: quote.hardwarePrice > 0 ? "#059669" : "#dc2626"
              }}>
                {formatPrice(quote.hardwarePrice)}
              </span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb"
            }}>
              <span style={{ fontSize: 14 }}>{t('Seals Price') || 'Seals Price'}</span>
              <span style={{
                fontWeight: 500,
                color: quote.sealsPrice > 0 ? "#059669" : "#dc2626"
              }}>
                {formatPrice(quote.sealsPrice)}
              </span>
            </div>
            {quote.addonsPrice > 0 && (
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb"
              }}>
                <span style={{ fontSize: 14 }}>{t('Add-ons Price') || 'Add-ons Price'}</span>
                <span style={{ fontWeight: 500, color: "#2563eb" }}>{formatPrice(quote.addonsPrice)}</span>
              </div>
            )}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #d1d5db"
            }}>
              <span style={{ fontWeight: 600 }}>{t('Subtotal') || 'Subtotal'}</span>
              <span style={{ fontWeight: 600, color: "#374151" }}>{formatPrice(quote.subtotal)}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #d1d5db"
            }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>{t('VAT (18%)') || 'VAT (18%)'}</span>
              <span style={{ color: "#6b7280" }}>{formatPrice(quote.vat)}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #d1d5db"
            }}>
              <span style={{ fontSize: 14, color: "#6b7280" }}>
                {t('Profit') || 'Profit'} ({companySettings?.profitMarginPercent || 20}%)
              </span>
              <span style={{ color: "#6b7280" }}>{formatPrice(quote.profit)}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              background: "#bae6fd",
              borderRadius: "0.5rem",
              paddingLeft: 12,
              paddingRight: 12,
              border: "2px solid #7dd3fc",
              marginTop: 8
            }}>
              <span style={{ fontWeight: 700, color: "#1e40af", fontSize: 18 }}>{t('Total') || 'Total'}</span>
              <span style={{ fontWeight: 700, color: "#1e40af", fontSize: 22 }}>{formatPrice(quote.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;