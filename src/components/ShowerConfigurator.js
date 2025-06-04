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

  // Default seal quantity to 1 when sealType changes and none is set
  useEffect(() => {
    if (formData.sealType && !formData.sealQuantity) {
      onFormChange('sealQuantity', 1);
    }
  }, [formData.sealType, formData.sealQuantity, onFormChange]);

  // Default hardware quantity to 1 when hardwareType changes and none is set
  useEffect(() => {
    if (formData.hardwareType && !formData.hardwareQuantity) {
      onFormChange('hardwareQuantity', 1);
    }
  }, [formData.hardwareType, formData.hardwareQuantity, onFormChange]);

  // Default glass quantity to 1 when glassType changes and none is set
  useEffect(() => {
    if (formData.glassType && !formData.glassQuantity) {
      onFormChange('glassQuantity', 1);
    }
  }, [formData.glassType, formData.glassQuantity, onFormChange]);

  // --- Short Premium Placeholders ---
  const placeholders = {
    showerType: t('showerTypePlaceholder') || "Type",
    model: t('modelPlaceholder') || "Model",
    glassType: t('glassTypePlaceholder') || "Glass",
    glassThickness: t('glassThicknessPlaceholder') || "Thickness",
    hardwareType: t('hardwareTypePlaceholder') || "Hardware",
    hardwareFinish: t('hardwareFinishPlaceholder') || "Finish",
    sealType: t('sealTypePlaceholder') || "Seal",
    quantity: t('qtyPlaceholder') || "Qty"
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-100 rounded-3xl shadow-2xl p-8 md:p-10 max-w-2xl mx-auto border border-blue-200">
      <h2 className="text-2xl font-extrabold mb-6 tracking-wide text-blue-900 text-center">
        {t('showerConfiguratorTitle') || "Shower Configurator"}
      </h2>

      {/* Shower Type */}
      <div className="mb-5">
        <label htmlFor="showerType" className="block text-sm font-semibold text-gray-700 mb-1">
          {t('showerTypeLabel') || "Shower Type"}
        </label>
        <select
          id="showerType"
          value={formData.showerType}
          onChange={e => onFormChange('showerType', e.target.value)}
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base transition duration-150"
        >
          <option value="" disabled>
            {placeholders.showerType}
          </option>
          {showerTypes.map(st => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="mb-5">
        <label htmlFor="model" className="block text-sm font-semibold text-gray-700 mb-1">
          {t('modelLabel') || "Model"}
        </label>
        <select
          id="model"
          value={formData.model}
          onChange={e => onFormChange('model', e.target.value)}
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base transition duration-150"
          disabled={!formData.showerType}
        >
          <option value="" disabled>
            {formData.showerType ? placeholders.model : t('selectShowerTypeFirst') || "First: Type"}
          </option>
          {filteredModels.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>

      {/* Glass Type + Quantity */}
      <div className="flex flex-col md:flex-row gap-2 mb-5">
        <div className="flex-1">
          <label htmlFor="glassType" className="block text-sm font-semibold text-gray-700 mb-1">
            {t('glassTypeLabel') || "Glass Type"}
          </label>
          <select
            id="glassType"
            value={formData.glassType}
            onChange={e => onFormChange('glassType', e.target.value)}
            className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
          >
            <option value="" disabled>{placeholders.glassType}</option>
            {glassTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-20">
          <label htmlFor="glassQuantity" className="text-xs text-gray-500 mb-1 ml-1">{t('quantityLabel') || "Qty"}</label>
          <select
            id="glassQuantity"
            value={formData.glassQuantity || 1}
            onChange={e => onFormChange('glassQuantity', Number(e.target.value))}
            className="rounded-lg border-gray-300 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-sm"
          >
            {quantityOptions.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Glass Thickness */}
      <div className="mb-5">
        <label htmlFor="glassThickness" className="block text-sm font-semibold text-gray-700 mb-1">
          {t('glassThicknessLabel') || "Glass Thickness"}
        </label>
        <select
          id="glassThickness"
          value={formData.glassThickness}
          onChange={e => onFormChange('glassThickness', e.target.value)}
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
        >
          <option value="" disabled>{placeholders.glassThickness}</option>
          {glassThicknesses.map(thickness => (
            <option key={thickness.id} value={thickness.id}>
              {thickness.thickness_mm}mm
            </option>
          ))}
        </select>
      </div>

      {/* Hardware Type + Finish + Quantity */}
      <div className="flex flex-col md:flex-row gap-2 mb-5">
        <div className="flex flex-col flex-1">
          <label htmlFor="hardwareType" className="block text-sm font-semibold text-gray-700 mb-1">
            {t('hardwareTypeLabel') || "Hardware Type"}
          </label>
          <select
            id="hardwareType"
            value={formData.hardwareType}
            onChange={e => onFormChange('hardwareType', e.target.value)}
            className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
          >
            <option value="" disabled>{placeholders.hardwareType}</option>
            {hardwareTypes.map(hw => (
              <option key={hw.id} value={hw.id}>{hw.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="hardwareFinish" className="block text-sm font-semibold text-gray-700 mb-1">
            {t('hardwareFinishLabel') || "Finish"}
          </label>
          <select
            id="hardwareFinish"
            value={formData.hardwareFinish}
            onChange={e => onFormChange('hardwareFinish', e.target.value)}
            className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
          >
            <option value="" disabled>{placeholders.hardwareFinish}</option>
            {finishes.map(finish => (
              <option key={finish.id} value={finish.id}>{finish.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-20">
          <label htmlFor="hardwareQuantity" className="text-xs text-gray-500 mb-1 ml-1">{t('quantityLabel') || "Qty"}</label>
          <select
            id="hardwareQuantity"
            value={formData.hardwareQuantity || 1}
            onChange={e => onFormChange('hardwareQuantity', Number(e.target.value))}
            className="rounded-lg border-gray-300 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-sm"
          >
            {quantityOptions.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Seal Type + Quantity */}
      <div className="flex flex-col md:flex-row gap-2 mb-5">
        <div className="flex flex-col flex-1">
          <label htmlFor="sealType" className="block text-sm font-semibold text-gray-700 mb-1">
            {t('sealTypeLabel') || "Seal Type"}
          </label>
          <select
            id="sealType"
            value={formData.sealType}
            onChange={e => {
              onFormChange('sealType', e.target.value);
              if (!formData.sealQuantity) onFormChange('sealQuantity', 1);
            }}
            className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
          >
            <option value="" disabled>{placeholders.sealType}</option>
            {sealTypes.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-20">
          <label htmlFor="sealQuantity" className="text-xs text-gray-500 mb-1 ml-1">{t('quantityLabel') || "Qty"}</label>
          <select
            id="sealQuantity"
            value={formData.sealQuantity || 1}
            onChange={e => onFormChange('sealQuantity', Number(e.target.value))}
            className="rounded-lg border-gray-300 p-2 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-sm"
          >
            {quantityOptions.map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-1">
            {t('heightLabel') || "Height (m)"}
          </label>
          <input
            id="height"
            type="number"
            step="0.01"
            min="1"
            max={MAX_HEIGHT}
            value={formData.height}
            onChange={e => onFormChange('height', e.target.value)}
            placeholder={t('heightPlaceholder') || "Height (m)"}
            className={`w-full p-3 border ${height > MAX_HEIGHT ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-base`}
          />
        </div>
        <div>
          <label htmlFor="width" className="block text-sm font-semibold text-gray-700 mb-1">
            {t('widthLabel') || "Width (m)"}
          </label>
          <input
            id="width"
            type="number"
            step="0.01"
            min="0.3"
            max={MAX_WIDTH}
            value={formData.width}
            onChange={e => onFormChange('width', e.target.value)}
            placeholder={t('widthPlaceholder') || "Width (m)"}
            className={`w-full p-3 border ${width > MAX_WIDTH ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-base`}
          />
        </div>
        {(() => {
          // Find the selected type by ID to check if its name is 'Corner'
          const selectedType = showerTypes.find(st => String(st.id) === String(formData.showerType));
          if (selectedType && selectedType.name.toLowerCase().includes("corner")) {
            return (
              <div className="col-span-2">
                <label htmlFor="length" className="block text-sm font-semibold text-gray-700 mb-1">
                  {t('lengthLabel') || "Length (m)"}
                </label>
                <input
                  id="length"
                  type="number"
                  step="0.01"
                  min="0.3"
                  value={formData.length}
                  onChange={e => onFormChange('length', e.target.value)}
                  placeholder={t('lengthPlaceholder') || "Length (m)"}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
                />
              </div>
            );
          }
          return null;
        })()}
      </div>

      {dimensionWarning && (
        <div className="mt-1 text-red-600 font-semibold text-xs text-center">
          {dimensionWarning}
        </div>
      )}
      {!dimensionWarning && installNotice && (
        <div className="mt-1 text-yellow-600 font-semibold text-xs text-center">
          {installNotice}
        </div>
      )}
    </div>
  );
};

export default ShowerConfigurator;