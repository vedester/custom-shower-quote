import React from 'react';

const MAX_HEIGHT = 2.4;
const MAX_WIDTH = 1.5;
const REGULAR_HEIGHT = 2.1;
const REGULAR_WIDTH = 1.5;

const ShowerConfigurator = ({ formData, onFormChange }) => {
  const height = parseFloat(formData.height) || '';
  const width = parseFloat(formData.width) || '';
  const length = parseFloat(formData.length) || '';

  let dimensionWarning = '';
  let installNotice = '';

  if (height > MAX_HEIGHT) {
    dimensionWarning = `Maximum allowed height is ${MAX_HEIGHT}m. Please adjust your value.`;
  } else if (width > MAX_WIDTH) {
    dimensionWarning = `Maximum allowed width is ${MAX_WIDTH}m. Please adjust your value.`;
  }

  if (!dimensionWarning) {
    if (height > REGULAR_HEIGHT) {
      installNotice = 'Notice: Height above 2.1m will require special installation and may increase the installation price.';
    } else if (width > REGULAR_WIDTH) {
      installNotice = 'Notice: Width above 1.5m will require special installation and may increase the installation price.';
    }
  }

  const showerTypes = [
    'Frontal (Wall-to-Wall)',
    'Corner',
    'CNC Cut',
    'Sliding Door',
    'Bathtub Screen (Partial)',
    'Bathtub Full Closure',
  ];

  const models = {
    'Frontal (Wall-to-Wall)': ['MTI-101', 'MTI-102', 'MTI-103'],
    'Corner': ['MTI-201', 'MTI-202', 'MTI-203'],
    'CNC Cut': ['MTI-301', 'MTI-302'],
    'Sliding Door': ['MTI-401', 'MTI-402'],
    'Bathtub Screen (Partial)': ['MTI-501', 'MTI-502'],
    'Bathtub Full Closure': ['MTI-601', 'MTI-602'],
  };

  const glassTypes = [
    'Clear', 'Extra Clear', 'Frosted', 'Grey', 'Bronze',
    'Granite', 'Papita', 'Stripes', 'Acid Etched',
    'Artistic Print', 'Custom Stripes', 'Galina',
    'Anti-Sun Grey', 'Anti-Sun Bronze',
  ];

  const finishes = [
    'Nickel', 'Black', 'White', 'Gold',
    'Graphite', 'Rose Gold', 'Matte Gold',
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) onFormChange('photo', file);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-2 space-y-4 border border-gray-200">
      <select
        id="showerType"
        value={formData.showerType}
        onChange={(e) => onFormChange('showerType', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
      >
        <option value="" disabled>Shower Type</option>
        {showerTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        id="model"
        value={formData.model}
        onChange={(e) => onFormChange('model', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
        disabled={!formData.showerType}
      >
        <option value="" disabled>{formData.showerType ? 'Model' : 'Select shower type first'}</option>
        {formData.showerType && models[formData.showerType].map(model => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      <select
        id="glassType"
        value={formData.glassType}
        onChange={(e) => onFormChange('glassType', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
      >
        <option value="" disabled>Glass Type</option>
        {glassTypes.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        id="glassThickness"
        value={formData.glassThickness}
        onChange={(e) => onFormChange('glassThickness', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
      >
        <option value="" disabled>Glass Thickness</option>
        <option value="6">6 mm</option>
        <option value="8">8 mm (Recommended)</option>
        <option value="10">10 mm</option>
      </select>

      <select
        id="hardwareFinish"
        value={formData.hardwareFinish}
        onChange={(e) => onFormChange('hardwareFinish', e.target.value)}
        className="w-full rounded border-gray-300 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-1"
      >
        <option value="" disabled>Hardware Finish</option>
        {finishes.map(finish => (
          <option key={finish} value={finish}>{finish}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-2">
        <input
          id="height"
          type="number"
          step="0.01"
          min="1"
          max={MAX_HEIGHT}
          value={formData.height}
          onChange={(e) => onFormChange('height', e.target.value)}
          placeholder="Height (m)"
          className={`w-full p-3 border ${height > MAX_HEIGHT ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:ring-2 focus:ring-blue-500 text-sm`}
        />
        <input
          id="width"
          type="number"
          step="0.01"
          min="0.3"
          max={MAX_WIDTH}
          value={formData.width}
          onChange={(e) => onFormChange('width', e.target.value)}
          placeholder="Width (m)"
          className={`w-full p-3 border ${width > MAX_WIDTH ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:ring-2 focus:ring-blue-500 text-sm`}
        />
        {formData.showerType === 'Corner' && (
          <input
            id="length"
            type="number"
            step="0.01"
            min="0.3"
            value={formData.length}
            onChange={(e) => onFormChange('length', e.target.value)}
            placeholder="Length (m)"
            className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 text-sm col-span-2"
          />
        )}
      </div>

      {dimensionWarning && (
        <div className="mt-1 text-red-600 font-semibold text-xs">{dimensionWarning}</div>
      )}
      {!dimensionWarning && installNotice && (
        <div className="mt-1 text-yellow-600 font-semibold text-xs">{installNotice}</div>
      )}
    </div>
  );
};

export default ShowerConfigurator;