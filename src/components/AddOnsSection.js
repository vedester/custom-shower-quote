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
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {addOns.map(addOn => {
            const qty = localQuantities[addOn.id] || 0;
            const isSelected = qty > 0;
            return (
              <div
                key={addOn.id}
                className={
                  `w-[90px] min-w-[90px] p-0.5 rounded-lg shadow border flex flex-col items-center justify-between transition ` +
                  `${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`
                }
              >
                <div>
                  <h4 className="text-[10px] font-bold text-center leading-tight">{addOn.label}</h4>
                  <p className="text-[9px] text-gray-500 mb-0.5 text-center">+${addOn.price}</p>
                </div>
                <div className="flex flex-col items-center mt-auto pt-0.5">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => updateQuantity(addOn.id, 1)}
                      className="px-1.5 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] font-semibold transition"
                    >
                      + Add
                    </button>
                  ) : (
                    <div className="flex items-center bg-gray-100 rounded-full px-0.5 py-0.5 shadow-inner">
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.id, -1)}
                        className="w-3.5 h-3.5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-[10px] font-bold transition"
                        aria-label="Decrease"
                      >−</button>
                      <span className="w-3.5 text-center font-medium text-[10px]">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(addOn.id, 1)}
                        className="w-3.5 h-3.5 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-[10px] font-bold transition"
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

      {/* Custom Add-on Input
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