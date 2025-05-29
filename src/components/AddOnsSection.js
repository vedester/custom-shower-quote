import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API = "https://shower-quote-backend.onrender.com/api";
export default function AddOnsSection({ addOnQuantities = {}, onFormChange, onPriceChange }) {
  const { t } = useTranslation();

  const [addOns, setAddOns] = useState([]);

  useEffect(() => {
    axios.get(`${API}/addons`).then(res => setAddOns(res.data));
  }, []);

  const [localQuantities, setLocalQuantities] = useState({});
  useEffect(() => {
    setLocalQuantities(
      Object.fromEntries(addOns.map(item => [item.name, addOnQuantities[item.name] || 0]))
    );
  }, [addOns, addOnQuantities]);

  useEffect(() => {
    const totalAddOnsPrice = addOns.reduce(
      (sum, addOn) => sum + (localQuantities[addOn.name] || 0) * addOn.price,
      0
    );
    if (typeof onPriceChange === 'function') {
      onPriceChange(totalAddOnsPrice);
    }
  }, [localQuantities, addOns, onPriceChange]);

  const updateQuantity = (id, delta) => {
    setLocalQuantities(prev => {
      const newQty = Math.max((prev[id] || 0) + delta, 0);
      const updated = { ...prev, [id]: newQty };
      onFormChange('addOnQuantities', updated);
      return updated;
    });
  };

  const totalAddOnsPrice = addOns.reduce(
    (sum, addOn) => sum + (localQuantities[addOn.name] || 0) * addOn.price,
    0
  );

  return (
    <div className="space-y-6 text-[90%]">
      <div className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {addOns.map(addOn => {
            const qty = localQuantities[addOn.name] || 0;
            const isSelected = qty > 0;
            return (
              <div
                key={addOn.id}
                className={`w-full max-w-[120px] p-2 rounded-xl shadow-md border flex flex-col items-center justify-between transition-all duration-200 h-[100px] ${
                  isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'
                } hover:shadow-lg hover:border-blue-400`}
              >
                <div className="text-center">
                  {/* Use the human-readable name directly */}
                  <h4 className="text-[10px] font-semibold text-gray-800 leading-tight">{addOn.name}</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5">+₪{addOn.price}</p>
                </div>
                <div className="flex flex-col items-center mt-1.5">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => updateQuantity(addOn.name, 1)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[10px] font-semibold"
                    >
                      + {t('Add')}
                    </button>
                  ) : (
                    <div className="flex items-center bg-gray-100 rounded-full px-1.5 py-0.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.name, -1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-base font-bold text-gray-800 transition"
                        aria-label={t("Decrease")}
                      >−</button>
                      <span className="w-5 text-center font-medium text-sm text-gray-800">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.name, 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-base font-bold text-gray-800 transition"
                        aria-label={t("Increase")}
                      >+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm font-semibold text-blue-700 text-right">
          {t("Total Add-Ons Price")}: ₪{totalAddOnsPrice}
        </div>
      </div>
    </div>
  );
}