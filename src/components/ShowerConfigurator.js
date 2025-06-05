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
  finishes: initialFinishes = [],
}) => {
  const { t } = useTranslation();

  // Dropdown options filtered by selected model
  const [showerTypes, setShowerTypes] = useState(initialShowerTypes);
  const [models, setModels] = useState(initialModels);
  const [finishes, setFinishes] = useState(initialFinishes);

  // Model-bound component options
  const [glassTypes, setGlassTypes] = useState([]);
  const [glassThicknesses, setGlassThicknesses] = useState([]);
  const [hardwareFinishes, setHardwareFinishes] = useState([]);
  const [sealTypes, setSealTypes] = useState([]);

  useEffect(() => {
    if (!initialShowerTypes.length) api.get('/shower-types').then(r => setShowerTypes(r.data));
    if (!initialModels.length) api.get('/models').then(r => setModels(r.data));
    if (!initialFinishes.length) api.get('/finishes').then(r => setFinishes(r.data));
    // eslint-disable-next-line
  }, []);

  // Fetch model-specific components when model changes
  useEffect(() => {
    if (!formData.model) {
      setGlassTypes([]);
      setGlassThicknesses([]);
      setHardwareFinishes([]);
      setSealTypes([]);
      return;
    }
    // Glass types and thicknesses for model
    api.get(`/model-glass-components/${formData.model}`).then(res => {
      const glassTypeSet = {};
      const thicknessSet = {};
      res.data.forEach(gc => {
        glassTypeSet[gc.glass_type_id] = gc.glass_type;
        thicknessSet[gc.thickness_id] = gc.thickness;
      });
      setGlassTypes(Object.entries(glassTypeSet).map(([id, name]) => ({ id, name })));
      setGlassThicknesses(Object.entries(thicknessSet).map(([id, thickness_mm]) => ({ id, thickness_mm })));
    });

    // Hardware finishes for model (from model-hardware-components)
    api.get(`/model-hardware-components/${formData.model}`).then(res => {
      // Only show the finish dropdown, deduplicated
      const finishMap = {};
      res.data.forEach(hw => {
        if (hw.finish_id && hw.finish) finishMap[hw.finish_id] = hw.finish;
      });
      setHardwareFinishes(Object.entries(finishMap).map(([id, name]) => ({ id, name })));
    });

    // Seal types for model
    api.get(`/model-seal-components/${formData.model}`).then(res => {
      const sealMap = {};
      res.data.forEach(st => {
        if (st.seal_type_id && st.seal_type) sealMap[st.seal_type_id] = st.seal_type;
      });
      setSealTypes(Object.entries(sealMap).map(([id, name]) => ({ id, name })));
    });
  }, [formData.model]);

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

  // --- Short Premium Placeholders ---
  const placeholders = {
    showerType: t('showerTypePlaceholder') || "Select Type",
    model: t('modelPlaceholder') || "Select Model",
    glassType: t('glassTypePlaceholder') || "Select Glass Type",
    glassThickness: t('glassThicknessPlaceholder') || "Select Thickness",
    hardwareFinish: t('hardwareFinishPlaceholder') || "Select Hardware Finish",
    sealType: t('sealTypePlaceholder') || "Select Seal Profile"
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
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
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
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
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

      {/* Glass Type */}
      <div className="mb-5">
        <label htmlFor="glassType" className="block text-sm font-semibold text-gray-700 mb-1">
          {t('glassTypeLabel') || "Glass Type"}
        </label>
        <select
          id="glassType"
          value={formData.glassType}
          onChange={e => onFormChange('glassType', e.target.value)}
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
          disabled={glassTypes.length === 0}
        >
          <option value="" disabled>{placeholders.glassType}</option>
          {glassTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
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
          disabled={glassThicknesses.length === 0}
        >
          <option value="" disabled>{placeholders.glassThickness}</option>
          {glassThicknesses.map(thickness => (
            <option key={thickness.id} value={thickness.id}>
              {thickness.thickness_mm}mm
            </option>
          ))}
        </select>
      </div>

      {/* Hardware Finish only, no hardware type */}
      <div className="mb-5">
        <label htmlFor="hardwareFinish" className="block text-sm font-semibold text-gray-700 mb-1">
          {t('hardwareFinishLabel') || "Hardware Finish"}
        </label>
        <select
          id="hardwareFinish"
          value={formData.hardwareFinish}
          onChange={e => onFormChange('hardwareFinish', e.target.value)}
          className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
          disabled={hardwareFinishes.length === 0}
        >
          <option value="" disabled>{placeholders.hardwareFinish}</option>
          {hardwareFinishes.map(finish => (
            <option key={finish.id} value={finish.id}>{finish.name}</option>
          ))}
        </select>
      </div>

      {/* Seal Profile */}
      <div className="mb-5">
  <label htmlFor="sealType" className="block text-sm font-semibold text-gray-700 mb-1">
    {t('sealTypeLabel') || "Seal Profile"}
  </label>
  <select
    id="sealType"
    value={formData.sealType || ""}
    onChange={e => onFormChange('sealType', e.target.value)}
    className="w-full rounded-lg border-gray-300 p-3 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 text-base"
    disabled={sealTypes.length === 0}
  >
    <option value="" disabled>
      {placeholders.sealType}
    </option>
    {sealTypes.map(st => (
      <option key={st.id} value={st.id}>{st.name}</option>
    ))}
  </select>
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
            placeholder={t('heightPlaceholder') || "Enter height"}
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
            placeholder={t('widthPlaceholder') || "Enter width"}
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
                  placeholder={t('lengthPlaceholder') || "Enter length"}
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