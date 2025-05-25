import React, { useState, useEffect } from 'react';

// List of available add-ons
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

  // Update parent state immediately when quantity changes
  const updateQuantity = (id, delta) => {
    setLocalQuantities(prev => {
      const newQty = Math.max((prev[id] || 0) + delta, 0);
      const updated = { ...prev, [id]: newQty };
      onFormChange('addOnQuantities', updated);
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Optional Add-ons Section (without heading) */}
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100">
        <div className="grid grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {addOns.map(addOn => {
            const qty = localQuantities[addOn.id] || 0;
            const isSelected = qty > 0;
            return (
              <div
                key={addOn.id}
                className={
                  `p-2 sm:p-4 rounded-2xl shadow transition border flex flex-col justify-between ` +
                  `${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`
                }
              >
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 text-center break-words leading-tight">
                    {addOn.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 text-center">+${addOn.price}</p>
                </div>
                {/* Quantity Controls pinned to bottom */}
                <div className="flex flex-col items-center mt-auto pt-2">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => updateQuantity(addOn.id, 1)}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.id, -1)}
                        className="w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-[13px] font-bold transition"
                        aria-label="Decrease"
                      >−</button>
                      <span className="w-5 text-center font-medium text-[13px]">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.id, 1)}
                        className="w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-[13px] font-bold transition"
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

      {/* Custom Add-on Input */}
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-100">
        <h4 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Other custom add-ons (optional)</h4>
        <input
          type="text"
          value={customAddon || ''}
          onChange={e => onFormChange('customAddon', e.target.value)}
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="Enter your custom add-on"
        />
      </div>
    </div>
  );
}