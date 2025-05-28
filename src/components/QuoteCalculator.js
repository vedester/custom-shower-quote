import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';

const QuoteCalculator = ({
  customerInfo,
  formData,
  glassTypes = [],
  finishes = [],
  addOns = [],
  prices = [],
  models = [],
  showerTypes = [],
  companySettings = {
    companyName: 'Custom Shower Glass Quote Calculator',
    companyEmail: 'maordh@gmail.com',
    companyPhone: '+97248406047',
    profitMargin: 0.3
  }
}) => {
  const { t, i18n } = useTranslation();

  // AddOn Quantities (from formData)
  const [addOnQuantities, setAddOnQuantities] = useState({});
  useEffect(() => {
    if (formData.addOnQuantities) {
      setAddOnQuantities({ ...formData.addOnQuantities });
    }
  }, [formData.addOnQuantities]);

  // AddOns config (price, quantity flag)
  const addOnsConfig = useMemo(() => {
    const obj = {};
    addOns.forEach(a => obj[a.name] = { price: a.price, quantity: true });
    return obj;
  }, [addOns]);

  // Find selected model and glass/finish/shower type for display
  const selectedModel = useMemo(
    () => models.find(m => m.id?.toString() === formData.model?.toString() || m.name === formData.model),
    [models, formData.model]
  );
  const selectedGlassType = useMemo(
    () => glassTypes.find(g => g.id?.toString() === formData.glassType?.toString() || g.name === formData.glassType),
    [glassTypes, formData.glassType]
  );
  const selectedFinish = useMemo(
    () => finishes.find(f => f.id?.toString() === formData.hardwareFinish?.toString() || f.name === formData.hardwareFinish),
    [finishes, formData.hardwareFinish]
  );
  const selectedShowerType = useMemo(
    () => showerTypes.find(st => st.id?.toString() === formData.showerType?.toString() || st.name === formData.showerType),
    [showerTypes, formData.showerType]
  );

  // Track the selected model image path for persistence (quote memory)
  const [savedModelImage, setSavedModelImage] = useState(null);
  useEffect(() => {
    if (selectedModel && selectedModel.image_path) {
      setSavedModelImage(selectedModel.image_path);
    }
  }, [selectedModel]);

  // Calculate Quote
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    if (!formData.height || !formData.width || !formData.glassType) return;
    let area;
    if (selectedShowerType?.name === 'Corner' || formData.showerType === 'Corner') {
      if (!formData.length) return;
      area = (parseFloat(formData.height) * parseFloat(formData.width)) +
             (parseFloat(formData.height) * parseFloat(formData.length));
    } else {
      area = parseFloat(formData.height) * parseFloat(formData.width);
    }

    let glassType = selectedGlassType;
    let finish = selectedFinish;
    let model = selectedModel;

    let priceEntry = prices.find(
      p => (!model || p.model_id === model.id) &&
           (!glassType || p.glass_type_id === glassType.id) &&
           (!finish || p.finish_id === finish.id)
    );
    let glassPrice = priceEntry ? priceEntry.price : (glassType?.price || 45);

    const basePrice = area * glassPrice;
    const hardwarePrice = finish?.price || 0;
    let addOnsCost = 0;
    Object.entries(addOnQuantities).forEach(([addon, qty]) => {
      const addOnObj = addOnsConfig[addon];
      if (addOnObj && qty > 0) {
        addOnsCost += (addOnObj.price) * qty;
      }
    });

    const subtotal = basePrice + hardwarePrice + addOnsCost;
    const finalPrice = subtotal * (1 + (companySettings.profitMargin || 0.3));
    setQuote({
      area: area.toFixed(2),
      basePrice: basePrice.toFixed(2),
      hardwarePrice: hardwarePrice.toFixed(2),
      addOnsCost: addOnsCost.toFixed(2),
      subtotal: subtotal.toFixed(2),
      finalPrice: finalPrice.toFixed(2)
    });
  }, [
    formData,
    addOnQuantities,
    glassTypes,
    finishes,
    addOnsConfig,
    prices,
    models,
    companySettings,
    selectedGlassType,
    selectedFinish,
    selectedModel,
    selectedShowerType
  ]);

  // Helper to resolve image path to full URL
  const getModelImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (/^https?:\/\//.test(imgPath)) return imgPath;
    return `http://localhost:5000${imgPath}`;
  };

  // Generate Quote Text (with actual values)
  const generateQuoteText = () => {
    const showerTypeLabel = selectedShowerType?.name || formData.showerType || '';
    const modelLabel = selectedModel?.name || formData.model || '';
    const glassTypeLabel = selectedGlassType?.name || formData.glassType || '';
    const finishLabel = selectedFinish?.name || formData.hardwareFinish || '';
    const allAddOns = Object.entries(addOnQuantities)
      .filter(([addon, qty]) => qty > 0)
      .map(([addon, qty]) =>
        addOnsConfig[addon]?.quantity
          ? `${addon} (x${qty})`
          : addon
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
Shower Type: ${showerTypeLabel}
Model: ${modelLabel}
Glass Type: ${glassTypeLabel}
Glass Thickness: ${formData.glassThickness}mm
Hardware Finish: ${finishLabel}

Dimensions:
Height: ${formData.height} m
Width: ${formData.width} m${(showerTypeLabel === 'Corner' || formData.showerType === 'Corner') && formData.length ? `\nLength: ${formData.length} m` : ''}

Add-ons: ${allAddOns.length > 0 ? allAddOns.join(', ') : 'None'}

PRICING BREAKDOWN:
Area: ${quote?.area} m²
Base Price: ₪${quote?.basePrice}
Hardware: ₪${quote?.hardwarePrice}
Add-ons: ₪${quote?.addOnsCost}
Subtotal: ₪${quote?.subtotal}
Final Price: ₪${quote?.finalPrice}

Generated on: ${new Date().toLocaleDateString()}
Company: ${companySettings.companyName}
Contact: ${companySettings.companyEmail}
    `.trim();
  };

  // PDF/Image
  const getImageBase64 = (url) =>
    new Promise((resolve) => {
      if (!url) return resolve(null);
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

  const downloadQuote = async () => {
    const isHebrew = i18n.language === 'he';
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    if (isHebrew) {
      doc.addFont('NotoSansHebrew-Regular.ttf', 'NotoSansHebrew', 'normal');
      doc.setFont('NotoSansHebrew');
    }

    let y = 10;

    // Insert the model image at the top of the PDF
    if (savedModelImage) {
      const imgUrl = getModelImageUrl(savedModelImage);
      const imgData = await getImageBase64(imgUrl);
      if (imgData) {
        doc.addImage(imgData, 'JPEG', 10, y, 55, 44);
        y += 50;
      }
    }

    const lines = doc.splitTextToSize(generateQuoteText(), 180);
    if (isHebrew) {
      doc.setFontSize(12);
      doc.text(lines, 200, y, { align: 'right' });
    } else {
      doc.text(lines, 10, y);
    }
    doc.save(`quote-${customerInfo.name || 'customer'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadTxt = () => {
    const blob = new Blob([generateQuoteText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${customerInfo.name || 'customer'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Only show the final price section in the summary card (frontend)
  return (
    <div style={{
      background: "#fff",
      borderRadius: "0.7rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      padding: "1.5rem"
    }}>
      <div style={{
        background: "#d1fae5",
        padding: "1.1rem",
        borderRadius: "0.7rem",
        border: "2px solid #6ee7b7",
        boxShadow: "0 2px 8px rgba(16,185,129,0.09)"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#555"
          }}>{t('Final Price')}</div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#059669",
            margin: "0.5rem 0"
          }}>
            {quote ? `₪${quote.finalPrice}` : '₪0.00'}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#555" }}>
            {t('Including {percent}% profit margin', { percent: Math.round((companySettings.profitMargin || 0.3) * 100) })}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          onClick={downloadQuote}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.8rem",
            background: "#059669",
            color: "#fff",
            borderRadius: "0.5rem",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            cursor: quote ? "pointer" : "not-allowed",
            opacity: quote ? 1 : 0.6
          }}
          title={t('Download PDF')}
          disabled={!quote}
        >
          <svg style={{ width: 20, height: 20, marginRight: 8 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {t('Download PDF')}
        </button>
        <button
          onClick={downloadTxt}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.8rem",
            background: "#374151",
            color: "#fff",
            borderRadius: "0.5rem",
            fontWeight: 600,
            fontSize: "1rem",
            border: "none",
            cursor: quote ? "pointer" : "not-allowed",
            opacity: quote ? 1 : 0.6
          }}
          title={t('Download TXT')}
          disabled={!quote}
        >
          <svg style={{ width: 20, height: 20, marginRight: 8 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m0 0l-3-3m3 3l3-3m-6 5h6" />
          </svg>
          {t('Download TXT')}
        </button>
      </div>
      {/* Communication buttons ... (unchanged) */}
    </div>
  );
};

export default QuoteCalculator;