//src/components/AddOnsSection.js
import React, { useState, useEffect } from 'react';

const addOns = [
  { id: 'Towel Handle', label: 'Towel Handle', price: 150 },
  { id: 'Nano Coating', label: 'Nano Coating', price: 200 },
  { id: 'Custom Notches', label: 'Custom Notches', price: 100 },
  { id: 'Wall Reinforcements', label: 'Wall Reinforcements', price: 180 },
  { id: 'Additional Seals', label: 'Additional Seals', price: 80 }
];

export default function AddOnsSection({ addOnQuantities = {}, onFormChange, customAddon }) {
  const [localQuantities, setLocalQuantities] = useState(
    Object.fromEntries(addOns.map(item => [item.id, addOnQuantities[item.id] || 0]))
  );

  useEffect(() => {
    setLocalQuantities(
      Object.fromEntries(addOns.map(item => [item.id, addOnQuantities[item.id] || 0]))
    );
  }, [addOnQuantities]);

  const updateQuantity = (id, delta) => {
    setLocalQuantities(prev => {
      const newQty = Math.max((prev[id] || 0) + delta, 0);
      const updated = { ...prev, [id]: newQty };
      onFormChange('addOnQuantities', updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6 text-[90%]">
      <div className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          {addOns.map(addOn => {
            const qty = localQuantities[addOn.id] || 0;
            const isSelected = qty > 0;
            return (
              <div
                key={addOn.id}
                className={`w-full max-w-[120px] p-2 rounded-xl shadow-md border flex flex-col items-center justify-between transition-all duration-200 h-[100px] ${
                  isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'
                } hover:shadow-lg hover:border-blue-400`}
              >
                <div className="text-center">
                  <h4 className="text-[10px] font-semibold text-gray-800 leading-tight">{addOn.label}</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5">+${addOn.price}</p>
                </div>
                <div className="flex flex-col items-center mt-1.5">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => updateQuantity(addOn.id, 1)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[10px] font-semibold"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center bg-gray-100 rounded-full px-1 py-0.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.id, -1)}
                        className="w-4 h-4 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-[9px] font-bold text-gray-800"
                        aria-label="Decrease"
                      >−</button>
                      <span className="w-4 text-center font-medium text-[9px] text-gray-800">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.id, 1)}
                        className="w-4 h-4 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full text-[9px] font-bold text-gray-800"
                        aria-label="Increase"
                      >+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Add-on Input (optional future section)
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100">
        <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Other custom add-ons (optional)</h4>
        <input
          type="text"
          value={customAddon || ''}
          onChange={e => onFormChange('customAddon', e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Enter your custom add-on"
        />
      </div> */}
    </div>
  );
}
