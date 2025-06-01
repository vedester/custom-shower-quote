import React, { useState, useEffect } from "react";

// Helper to get unique values for a given key
const getUniqueValues = (arr, key) =>
  [...new Set(arr.map(item => item[key]).filter(Boolean))];

const FindHardwarePrice = ({ hardwarePricing }) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");
  const [priceResult, setPriceResult] = useState(null);

  useEffect(() => {
    console.log("hardwarePricing data:", hardwarePricing);
  }, [hardwarePricing]);

  const hardwareTypes = getUniqueValues(hardwarePricing, "hardware_type");
  const finishes = getUniqueValues(
    hardwarePricing.filter(
      p => !selectedType || p.hardware_type === selectedType
    ),
    "finish"
  );

  useEffect(() => {
    if (hardwareTypes.length && !selectedType) setSelectedType(hardwareTypes[0]);
  }, [hardwareTypes, selectedType]);
  useEffect(() => {
    if (finishes.length && !selectedFinish) setSelectedFinish(finishes[0]);
  }, [finishes, selectedFinish]);

  useEffect(() => {
    if (!selectedType || !selectedFinish) {
      setPriceResult(null);
      return;
    }
    const found = hardwarePricing.find(
      p => p.hardware_type === selectedType && p.finish === selectedFinish
    );
    setPriceResult(found ? (found.price ?? found.unit_price) : null);
  }, [selectedType, selectedFinish, hardwarePricing]);

  return (
    <div className="p-4 bg-gray-50 rounded shadow max-w-md">
      <h3 className="font-bold text-lg mb-2 text-blue-700">Test Hardware Pricing</h3>
      {hardwareTypes.length === 0 ? (
        <p className="text-red-600">No hardware pricing data loaded.</p>
      ) : (
        <>
          <div className="mb-2">
            <label className="mr-2 font-medium">Hardware Type:</label>
            <select
              value={selectedType}
              onChange={e => {
                setSelectedType(e.target.value);
                setSelectedFinish(""); // Reset finish for new type
              }}
              className="border rounded p-1"
            >
              {hardwareTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="mr-2 font-medium">Finish:</label>
            <select
              value={selectedFinish}
              onChange={e => setSelectedFinish(e.target.value)}
              className="border rounded p-1"
            >
              {finishes.map(finish => (
                <option key={finish} value={finish}>{finish}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            {selectedType && selectedFinish ? (
              priceResult !== null && priceResult !== undefined ? (
                <span className="text-green-700 font-semibold">
                  Price: ${priceResult}
                </span>
              ) : (
                <span className="text-red-700 font-semibold">
                  No price found for {selectedType} with {selectedFinish} finish
                </span>
              )
            ) : (
              <span className="text-gray-700">Select hardware type and finish to test price.</span>
            )}
          </div>
      </>
      )}
      <div className="mt-4 text-xs text-gray-500">
        <strong>Debug Data:</strong>
        <pre>{JSON.stringify(hardwarePricing, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FindHardwarePrice;