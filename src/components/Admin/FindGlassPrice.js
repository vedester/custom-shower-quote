import React, { useEffect, useState } from "react";

// Helper to get unique glass types and thicknesses from the pricing data
const getUniqueValues = (arr, key) => [...new Set(arr.map(item => item[key]).filter(Boolean))];

const FindGlassPrice = ({ glassPricing }) => {
  const [selectedGlassType, setSelectedGlassType] = useState("");
  const [selectedThickness, setSelectedThickness] = useState("");
  const [priceResult, setPriceResult] = useState(null);

  // Get all unique glass types and thicknesses for dropdowns
  const glassTypes = getUniqueValues(glassPricing, "glass_type");
  const thicknesses = getUniqueValues(
    glassPricing.filter(p => !selectedGlassType || p.glass_type === selectedGlassType),
    "thickness_mm"
  );

  // Set defaults when data loads
  useEffect(() => {
    if (glassTypes.length && !selectedGlassType) setSelectedGlassType(glassTypes[0]);
  }, [glassTypes, selectedGlassType]);
  useEffect(() => {
    if (thicknesses.length && !selectedThickness) setSelectedThickness(thicknesses[0]);
  }, [thicknesses, selectedThickness]);

  // Calculate price when selection changes
  useEffect(() => {
    if (!selectedGlassType || !selectedThickness) {
      setPriceResult(null);
      return;
    }
    const found = glassPricing.find(
      p => p.glass_type === selectedGlassType && p.thickness_mm === Number(selectedThickness)
    );
    setPriceResult(found ? found.price_per_m2 : null);
  }, [selectedGlassType, selectedThickness, glassPricing]);

  return (
    <div className="p-4 bg-gray-50 rounded shadow max-w-md">
      <h3 className="font-bold text-lg mb-2 text-blue-700">Test Glass Pricing</h3>
      {glassTypes.length === 0 ? (
        <p className="text-red-600">No glass pricing data loaded.</p>
      ) : (
        <>
          <div className="mb-2">
            <label className="mr-2 font-medium" htmlFor="glassTypeSelect">Glass Type:</label>
            <select
              id="glassTypeSelect"
              value={selectedGlassType}
              onChange={e => {
                setSelectedGlassType(e.target.value);
                setSelectedThickness(""); // Reset thickness for new type
              }}
              className="border rounded p-1"
            >
              {glassTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="mr-2 font-medium" htmlFor="thicknessSelect">Thickness (mm):</label>
            <select
              id="thicknessSelect"
              value={selectedThickness}
              onChange={e => setSelectedThickness(e.target.value)}
              className="border rounded p-1"
            >
              {thicknesses.map(thick => (
                <option key={thick} value={thick}>{thick}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            {selectedGlassType && selectedThickness ? (
              priceResult !== null ? (
                <span className="text-green-700 font-semibold">
                  Price: ${priceResult} per m²
                </span>
              ) : (
                <span className="text-red-700 font-semibold">
                  No price found for {selectedGlassType} {selectedThickness}mm
                </span>
              )
            ) : (
              <span className="text-gray-700">Select glass type and thickness to test price.</span>
            )}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <strong>Debug:</strong>
            <pre>{JSON.stringify({ selectedGlassType, selectedThickness, priceResult }, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default FindGlassPrice;