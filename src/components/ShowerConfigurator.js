import React from 'react';
import { useTranslation } from 'react-i18next';

const MAX_HEIGHT = 2.4;
const MAX_WIDTH = 1.5;
const REGULAR_HEIGHT = 2.1;
const REGULAR_WIDTH = 1.5;

const ShowerConfigurator = ({
  formData,
  onFormChange,
  showerTypes = [],
  models = [],
  glassTypes = [],
  glassThicknesses = [],
  finishes = []
}) => {
  const { t } = useTranslation();

  const height = parseFloat(formData.height) || '';
  const width = parseFloat(formData.width) || '';
  const length = parseFloat(formData.length) || '';

  let dimensionWarning = '';
  let installNotice = '';

  if (height > MAX_HEIGHT) {
    dimensionWarning = t('dimensionHeightWarning', { maxHeight: MAX_HEIGHT });
  } else if (width > MAX_WIDTH) {
    dimensionWarning = t('dimensionWidthWarning', { maxWidth: MAX_WIDTH });
  }

  if (!dimensionWarning) {
    if (height > REGULAR_HEIGHT) {
      installNotice = t('installNoticeHeight', { regularHeight: REGULAR_HEIGHT });
    } else if (width > REGULAR_WIDTH) {
      installNotice = t('installNoticeWidth', { regularWidth: REGULAR_WIDTH });
    }
  }

  // Only show models for selected shower type
  const filteredModels = models.filter(
    (m) => String(m.shower_type_id) === String(formData.showerType)
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-4 space-y-4 border border-gray-200">
      <select
        id="showerType"
        value={formData.showerType}
        onChange={e => onFormChange('showerType', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
      >
        <option value="" disabled>{t('showerTypeLabel') || "Select Shower Type"}</option>
        {showerTypes.map(st => (
          <option key={st.id} value={st.id}>{st.name}</option>
        ))}
      </select>

      <select
        id="model"
        value={formData.model}
        onChange={e => onFormChange('model', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
        disabled={!formData.showerType}
      >
        <option value="" disabled>
          {formData.showerType ? (t('modelLabel') || "Select Model") : (t('selectShowerTypeFirst') || "Select Shower Type First")}
        </option>
        {filteredModels.map(model => (
          <option key={model.id} value={model.id}>{model.name}</option>
        ))}
      </select>

      <select
        id="glassType"
        value={formData.glassType}
        onChange={e => onFormChange('glassType', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
      >
        <option value="" disabled>{t('glassTypeLabel') || "Select Glass Type"}</option>
        {glassTypes.map(type => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>

      <select
        id="glassThickness"
        value={formData.glassThickness}
        onChange={e => onFormChange('glassThickness', e.target.value)}
        className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-4"
      >
        <option value="" disabled>{t('glassThicknessLabel') || "Select Glass Thickness"}</option>
        {glassThicknesses.map(thickness => (
          <option key={thickness.id} value={thickness.id}>
            {thickness.thickness_mm}mm
          </option>
        ))}
      </select>

      <select
        id="hardwareFinish"
        value={formData.hardwareFinish}
        onChange={e => onFormChange('hardwareFinish', e.target.value)}
        className="w-full rounded border-gray-300 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm mb-1"
      >
        <option value="" disabled>{t('hardwareFinishLabel') || "Select Hardware Finish"}</option>
        {finishes.map(finish => (
          <option key={finish.id} value={finish.id}>{finish.name}</option>
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
          onChange={e => onFormChange('height', e.target.value)}
          placeholder={t('heightPlaceholder') || "Height (m)"}
          className={`w-full p-3 border ${height > MAX_HEIGHT ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:ring-2 focus:ring-blue-500 text-sm`}
        />
        <input
          id="width"
          type="number"
          step="0.01"
          min="0.3"
          max={MAX_WIDTH}
          value={formData.width}
          onChange={e => onFormChange('width', e.target.value)}
          placeholder={t('widthPlaceholder') || "Width (m)"}
          className={`w-full p-3 border ${width > MAX_WIDTH ? 'border-red-500' : 'border-gray-300'} rounded shadow-sm focus:ring-2 focus:ring-blue-500 text-sm`}
        />
        {(() => {
          // Find the selected type by ID to check if its name is 'Corner'
          const selectedType = showerTypes.find(st => String(st.id) === String(formData.showerType));
          if (selectedType && selectedType.name.toLowerCase().includes("corner")) {
            return (
              <input
                id="length"
                type="number"
                step="0.01"
                min="0.3"
                value={formData.length}
                onChange={e => onFormChange('length', e.target.value)}
                placeholder={t('lengthPlaceholder') || "Length (m)"}
                className="w-full p-3 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 text-sm col-span-2"
              />
            );
          }
          return null;
        })()}
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