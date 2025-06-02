import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from './Admin/api';

const MAX_HEIGHT = 2.4;
const MAX_WIDTH = 1.5;
const REGULAR_HEIGHT = 2.1;
const REGULAR_WIDTH = 1.5;

const ShowerConfigurator = ({
  formData,
  onFormChange,
  showerTypes: initialShowerTypes = [],
  models: initialModels = [],
  glassTypes: initialGlassTypes = [],
  glassThicknesses: initialGlassThicknesses = [],
  finishes: initialFinishes = [],
  sealTypes: initialSealTypes = [],
  hardwareTypes: initialHardwareTypes = []
}) => {
  const { t } = useTranslation();

  // Fetch lists from API for dropdowns (populates if not already passed as props)
  const [showerTypes, setShowerTypes] = useState(initialShowerTypes);
  const [models, setModels] = useState(initialModels);
  const [glassTypes, setGlassTypes] = useState(initialGlassTypes);
  const [glassThicknesses, setGlassThicknesses] = useState(initialGlassThicknesses);
  const [finishes, setFinishes] = useState(initialFinishes);
  const [sealTypes, setSealTypes] = useState(initialSealTypes);
  const [hardwareTypes, setHardwareTypes] = useState(initialHardwareTypes);

  useEffect(() => {
    if (!initialShowerTypes.length) api.get('/shower-types').then(r => setShowerTypes(r.data));
    if (!initialModels.length) api.get('/models').then(r => setModels(r.data));
    if (!initialGlassTypes.length) api.get('/glass-types').then(r => setGlassTypes(r.data));
    if (!initialGlassThicknesses.length) api.get('/glass-thicknesses').then(r => setGlassThicknesses(r.data));
    if (!initialFinishes.length) api.get('/finishes').then(r => setFinishes(r.data));
    if (!initialSealTypes.length) api.get('/seal-types').then(r => setSealTypes(r.data));
    if (!initialHardwareTypes.length) api.get('/hardware-types').then(r => setHardwareTypes(r.data));
  // eslint-disable-next-line
  }, []);

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

  // For quantity dropdown (1-10)
  const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-4 space-y-4 border border-gray-200">
      {/* Shower Type */}
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

      {/* Model */}
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

      {/* Glass Type + Quantity */}
      <div className="flex gap-2 mb-4">
        <select
          id="glassType"
          value={formData.glassType}
          onChange={e => onFormChange('glassType', e.target.value)}
          className="flex-1 rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="" disabled>{t('glassTypeLabel') || "Select Glass Type"}</option>
          {glassTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <div className="flex flex-col items-start justify-center w-24">
          <label htmlFor="glassQuantity" className="text-xs text-gray-500 mb-1 ml-1">{t('quantityLabel') || "Quantity"}</label>
          <select
            id="glassQuantity"
            value={formData.glassQuantity || 1}
            onChange={e => onFormChange('glassQuantity', e.target.value)}
            className="rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {quantityOptions.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Glass Thickness */}
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

      {/* Hardware Type + Finish + Quantity */}
      <div className="flex gap-2 mb-4">
        <div className="flex flex-col items-start justify-center flex-1">
          <label htmlFor="hardwareType" className="text-xs text-gray-500 mb-1 ml-1">{t('hardwareTypeLabel') || "Hardware Type"}</label>
          <select
            id="hardwareType"
            value={formData.hardwareType}
            onChange={e => onFormChange('hardwareType', e.target.value)}
            className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="" disabled>{t('hardwareTypeLabel') || "Select Hardware Type"}</option>
            {hardwareTypes.map(hw => (
              <option key={hw.id} value={hw.id}>{hw.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start justify-center flex-1">
          <label htmlFor="hardwareFinish" className="text-xs text-gray-500 mb-1 ml-1">{t('hardwareFinishLabel') || "Finish"}</label>
          <select
            id="hardwareFinish"
            value={formData.hardwareFinish}
            onChange={e => onFormChange('hardwareFinish', e.target.value)}
            className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="" disabled>{t('hardwareFinishLabel') || "Select Hardware Finish"}</option>
            {finishes.map(finish => (
              <option key={finish.id} value={finish.id}>{finish.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start justify-center w-24">
          <label htmlFor="hardwareQuantity" className="text-xs text-gray-500 mb-1 ml-1">{t('quantityLabel') || "Quantity"}</label>
          <select
            id="hardwareQuantity"
            value={formData.hardwareQuantity || 1}
            onChange={e => onFormChange('hardwareQuantity', e.target.value)}
            className="rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {quantityOptions.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Seal Type + Quantity */}
      <div className="flex gap-2 mb-4">
        <div className="flex flex-col items-start justify-center flex-1">
          <label htmlFor="sealType" className="text-xs text-gray-500 mb-1 ml-1">{t('sealTypeLabel') || "Seal Type"}</label>
          <select
            id="sealType"
            value={formData.sealType}
            onChange={e => onFormChange('sealType', e.target.value)}
            className="w-full rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="" disabled>{t('sealTypeLabel') || "Select Seal Type"}</option>
            {sealTypes.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-start justify-center w-24">
          <label htmlFor="sealQuantity" className="text-xs text-gray-500 mb-1 ml-1">{t('quantityLabel') || "Quantity"}</label>
          <select
            id="sealQuantity"
            value={formData.sealQuantity || 1}
            onChange={e => onFormChange('sealQuantity', e.target.value)}
            className="rounded border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {quantityOptions.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dimensions */}
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