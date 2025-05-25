import React from 'react';

const MAX_HEIGHT = 2.4;
const MAX_WIDTH = 1.5;
const REGULAR_HEIGHT = 2.1;
const REGULAR_WIDTH = 1.5;

const ShowerConfigurator = ({ formData, onFormChange }) => {
  // Validation logic
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
    <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800">Configure Your Shower</h2>

      {/* Shower Type */}
      <div>
        <label htmlFor="showerType" className="text-sm font-medium text-gray-700">Shower Type</label>
        <select
          id="showerType"
          value={formData.showerType}
          onChange={(e) => onFormChange('showerType', e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select shower type --</option>
          {showerTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Model - always visible */}
      <div>
        <label htmlFor="model" className="text-sm font-medium text-gray-700">Model</label>
        <select
          id="model"
          value={formData.model}
          onChange={(e) => onFormChange('model', e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500"
          disabled={!formData.showerType}
        >
          <option value="">
            {formData.showerType ? '-- Select model --' : 'Select shower type first'}
          </option>
          {formData.showerType &&
            models[formData.showerType].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="glassType" className="text-sm font-medium text-gray-700">Glass Type</label>
        <select
          id="glassType"
          value={formData.glassType}
          onChange={(e) => onFormChange('glassType', e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select glass type --</option>
          {glassTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="glassThickness" className="text-sm font-medium text-gray-700">Glass Thickness</label>
        <select
          id="glassThickness"
          value={formData.glassThickness}
          onChange={(e) => onFormChange('glassThickness', e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select thickness --</option>
          <option value="6">6 mm</option>
          <option value="8">8 mm (Recommended)</option>
          <option value="10">10 mm</option>
        </select>
      </div>

      <div>
        <label htmlFor="hardwareFinish" className="text-sm font-medium text-gray-700">Hardware Finish</label>
        <select
          id="hardwareFinish"
          value={formData.hardwareFinish}
          onChange={(e) => onFormChange('hardwareFinish', e.target.value)}
          className="mt-1 w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select finish --</option>
          {finishes.map(finish => (
            <option key={finish} value={finish}>{finish}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Dimensions (meters)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="height" className="text-sm text-gray-700">Height</label>
            <input
              id="height"
              type="number"
              step="0.01"
              min="1"
              max={MAX_HEIGHT}
              value={formData.height}
              onChange={(e) => onFormChange('height', e.target.value)}
              placeholder="e.g. 2.0"
              className={`w-full p-3 border ${height > MAX_HEIGHT ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div>
            <label htmlFor="width" className="text-sm text-gray-700">Width</label>
            <input
              id="width"
              type="number"
              step="0.01"
              min="0.3"
              max={MAX_WIDTH}
              value={formData.width}
              onChange={(e) => onFormChange('width', e.target.value)}
              placeholder="e.g. 1.5"
              className={`w-full p-3 border ${width > MAX_WIDTH ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          {formData.showerType === 'Corner' && (
            <div className="col-span-2">
              <label htmlFor="length" className="text-sm text-gray-700">Length</label>
              <input
                id="length"
                type="number"
                step="0.01"
                min="0.3"
                value={formData.length}
                onChange={(e) => onFormChange('length', e.target.value)}
                placeholder="e.g. 1.2"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        {/* Validation and Notice Messages */}
        {dimensionWarning && (
          <div className="mt-2 text-red-600 font-semibold text-sm">{dimensionWarning}</div>
        )}
        {!dimensionWarning && installNotice && (
          <div className="mt-2 text-yellow-600 font-semibold text-sm">{installNotice}</div>
        )}
      </div>

      {/* Only keep photo upload here */}
      <div>
        <label htmlFor="photo-upload" className="text-sm font-medium text-gray-700 mb-1 block">Upload Shower Photo (Optional)</label>
        <div className="flex items-center">
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center text-sm text-gray-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {formData.photo ? formData.photo.name : 'Choose Photo'}
          </label>
        </div>
      </div>

      {formData.photo && (
        <div className="mt-3">
          <img
            src={URL.createObjectURL(formData.photo)}
            alt="Shower Preview"
            className="w-full max-w-xs rounded-xl border border-gray-200 shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ShowerConfigurator;
