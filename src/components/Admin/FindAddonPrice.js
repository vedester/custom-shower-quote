import React, { useState, useEffect } from "react";

const FindAddonPrice = ({ addonPricing }) => {
  const [selectedAddon, setSelectedAddon] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(null);

  // Set default selected add-on if available
  useEffect(() => {
    if (addonPricing && addonPricing.length > 0 && !selectedAddon) {
      setSelectedAddon(addonPricing[0].name);
    }
  }, [addonPricing, selectedAddon]);

  // Update unit price when selected add-on changes
  useEffect(() => {
    const found = addonPricing.find(a => a.name === selectedAddon);
    setUnitPrice(found ? found.price : null);
  }, [selectedAddon, addonPricing]);

  const handleQuantityChange = (delta) => {
    setQuantity(q => Math.max(1, q + delta));
  };

  return (
    <div className="p-4 bg-gray-50 rounded shadow max-w-md">
      <h3 className="font-bold text-lg mb-2 text-blue-700">Test Add-On Pricing</h3>
      {addonPricing.length === 0 ? (
        <p className="text-red-600">No add-on pricing data loaded.</p>
      ) : (
        <>
          <div className="mb-2">
            <label className="mr-2 font-medium">Add-On:</label>
            <select
              value={selectedAddon}
              onChange={e => { setSelectedAddon(e.target.value); setQuantity(1); }}
              className="border rounded p-1"
            >
              {addonPricing.map(addon => (
                <option key={addon.id} value={addon.name}>
                  {addon.name} (₪{addon.price})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2 flex items-center">
            <span className="mr-2 font-medium">Unit Price: </span>
            <span className="mr-4 text-green-700 font-semibold">
              {unitPrice !== null ? `₪${unitPrice}` : "--"}
            </span>
            <button
              className="px-2 py-1 bg-gray-200 rounded mr-2"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >−</button>
            <span className="font-semibold">{quantity}</span>
            <button
              className="px-2 py-1 bg-gray-200 rounded ml-2"
              onClick={() => handleQuantityChange(1)}
            >+</button>
          </div>
          <div className="mt-4">
            <span className="font-medium">Total Add-Ons Price: </span>
            <span className="text-blue-700 font-bold">
              {unitPrice !== null ? `₪${unitPrice * quantity}` : "--"}
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <strong>Debug Data:</strong>
            <pre>{JSON.stringify(addonPricing, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default FindAddonPrice;