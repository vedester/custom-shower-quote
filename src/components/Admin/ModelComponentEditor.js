import React, { useEffect, useState } from "react";
import api from "./api";

/**
 * Admin component to manage which glass, hardware, and seal components
 * are available for a given model. This works with the backend grouping logic
 * and provides a professional, user-friendly editing experience.
 */
const ModelComponentEditor = ({ model, refreshModels }) => {
  // Model-specific component lists
  const [glass, setGlass] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [seals, setSeals] = useState([]);

  // All available options for dropdowns
  const [allGlassTypes, setAllGlassTypes] = useState([]);
  const [allThicknesses, setAllThicknesses] = useState([]);
  const [allHardwareTypes, setAllHardwareTypes] = useState([]);
  const [allFinishes, setAllFinishes] = useState([]);
  const [allSealTypes, setAllSealTypes] = useState([]);

  // Form state for new assignments
  const [glassForm, setGlassForm] = useState({ glass_type_id: "", thickness_id: "", quantity: 1 });
  const [hardwareForm, setHardwareForm] = useState({ hardware_type_id: "", finish_id: "", quantity: 1 });
  const [sealForm, setSealForm] = useState({ seal_type_id: "", quantity: 1 });

  // Fetch current model's components and all option lists
  useEffect(() => {
    if (!model?.id) return;
    api.get(`/model-glass-components/${model.id}`).then(res => setGlass(res.data));
    api.get(`/model-hardware-components/${model.id}`).then(res => setHardware(res.data));
    api.get(`/model-seal-components/${model.id}`).then(res => setSeals(res.data));
  }, [model, refreshModels]);

  useEffect(() => {
    api.get("/glass-types").then(r => setAllGlassTypes(r.data));
    api.get("/glass-thicknesses").then(r => setAllThicknesses(r.data));
    api.get("/hardware-types").then(r => setAllHardwareTypes(r.data));
    api.get("/finishes").then(r => setAllFinishes(r.data));
    api.get("/seal-types").then(r => setAllSealTypes(r.data));
  }, []);

  // Add handlers
  const addGlass = async () => {
    if (!glassForm.glass_type_id || !glassForm.thickness_id) return;
    await api.post(`/model-glass-components`, {
      ...glassForm,
      model_id: model.id,
      quantity: Number(glassForm.quantity) || 1,
    });
    setGlassForm({ glass_type_id: "", thickness_id: "", quantity: 1 });
    refreshModels();
  };

  const addHardware = async () => {
    if (!hardwareForm.hardware_type_id || !hardwareForm.finish_id) return;
    await api.post(`/model-hardware-components`, {
      ...hardwareForm,
      model_id: model.id,
      quantity: Number(hardwareForm.quantity) || 1,
    });
    setHardwareForm({ hardware_type_id: "", finish_id: "", quantity: 1 });
    refreshModels();
  };

  const addSeal = async () => {
    if (!sealForm.seal_type_id) return;
    await api.post(`/model-seal-components`, {
      ...sealForm,
      model_id: model.id,
      quantity: Number(sealForm.quantity) || 1,
    });
    setSealForm({ seal_type_id: "", quantity: 1 });
    refreshModels();
  };

  // Delete handlers
  const delGlass = async (id) => {
    await api.delete(`/model-glass-components/${id}`);
    refreshModels();
  };
  const delHardware = async (id) => {
    await api.delete(`/model-hardware-components/${id}`);
    refreshModels();
  };
  const delSeal = async (id) => {
    await api.delete(`/model-seal-components/${id}`);
    refreshModels();
  };

  return (
    <div className="w-full mt-4 bg-white rounded-xl shadow border border-blue-100 p-4 mb-8">
      <h3 className="text-lg font-bold text-blue-900 mb-4">Configure Components for <span className="text-blue-700">{model?.name}</span></h3>

      {/* GLASS COMPONENTS */}
      <section className="mb-6">
        <div className="font-semibold mb-1 text-blue-800">Glass Panels</div>
        <table className="w-full mb-1">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left py-1">Type</th>
              <th className="text-left py-1">Thickness</th>
              <th className="text-center py-1">Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {glass.map(g => (
              <tr key={g.id} className="border-b hover:bg-blue-50">
                <td className="py-1">{g.glass_type}</td>
                <td className="py-1">{g.thickness} mm</td>
                <td className="py-1 text-center">{g.quantity}</td>
                <td>
                  <button className="text-xs text-red-600 hover:underline" onClick={() => delGlass(g.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  value={glassForm.glass_type_id}
                  onChange={e => setGlassForm(f => ({ ...f, glass_type_id: e.target.value }))}
                  className="border px-2 py-1 text-xs rounded"
                >
                  <option value="">Choose type...</option>
                  {allGlassTypes.map(gt => (
                    <option key={gt.id} value={gt.id}>{gt.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={glassForm.thickness_id}
                  onChange={e => setGlassForm(f => ({ ...f, thickness_id: e.target.value }))}
                  className="border px-2 py-1 text-xs rounded"
                >
                  <option value="">Choose thickness...</option>
                  {allThicknesses.map(tk => (
                    <option key={tk.id} value={tk.id}>{tk.thickness_mm} mm</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={glassForm.quantity}
                  min={1}
                  onChange={e => setGlassForm(f => ({ ...f, quantity: e.target.value }))}
                  className="border px-2 py-1 w-16 text-xs rounded text-center"
                />
              </td>
              <td>
                <button
                  className="text-xs text-blue-700 font-semibold hover:underline"
                  onClick={addGlass}
                  title="Add Glass Panel"
                >Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* HARDWARE COMPONENTS */}
      <section className="mb-6">
        <div className="font-semibold mb-1 text-blue-800">Hardware</div>
        <table className="w-full mb-1">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left py-1">Type</th>
              <th className="text-left py-1">Finish</th>
              <th className="text-center py-1">Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hardware.map(h => (
              <tr key={h.id} className="border-b hover:bg-blue-50">
                <td className="py-1">{h.hardware_type}</td>
                <td className="py-1">{h.finish}</td>
                <td className="py-1 text-center">{h.quantity}</td>
                <td>
                  <button className="text-xs text-red-600 hover:underline" onClick={() => delHardware(h.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  value={hardwareForm.hardware_type_id}
                  onChange={e => setHardwareForm(f => ({ ...f, hardware_type_id: e.target.value }))}
                  className="border px-2 py-1 text-xs rounded"
                >
                  <option value="">Choose type...</option>
                  {allHardwareTypes.map(ht => (
                    <option key={ht.id} value={ht.id}>{ht.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={hardwareForm.finish_id}
                  onChange={e => setHardwareForm(f => ({ ...f, finish_id: e.target.value }))}
                  className="border px-2 py-1 text-xs rounded"
                >
                  <option value="">Choose finish...</option>
                  {allFinishes.map(fn => (
                    <option key={fn.id} value={fn.id}>{fn.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={hardwareForm.quantity}
                  min={1}
                  onChange={e => setHardwareForm(f => ({ ...f, quantity: e.target.value }))}
                  className="border px-2 py-1 w-16 text-xs rounded text-center"
                />
              </td>
              <td>
                <button
                  className="text-xs text-blue-700 font-semibold hover:underline"
                  onClick={addHardware}
                  title="Add Hardware"
                >Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* SEAL COMPONENTS */}
      <section>
        <div className="font-semibold mb-1 text-blue-800">Seals</div>
        <table className="w-full mb-1">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="text-left py-1">Type</th>
              <th className="text-center py-1">Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {seals.map(s => (
              <tr key={s.id} className="border-b hover:bg-blue-50">
                <td className="py-1">{s.seal_type}</td>
                <td className="py-1 text-center">{s.quantity}</td>
                <td>
                  <button className="text-xs text-red-600 hover:underline" onClick={() => delSeal(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  value={sealForm.seal_type_id}
                  onChange={e => setSealForm(f => ({ ...f, seal_type_id: e.target.value }))}
                  className="border px-2 py-1 text-xs rounded"
                >
                  <option value="">Choose type...</option>
                  {allSealTypes.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={sealForm.quantity}
                  min={1}
                  onChange={e => setSealForm(f => ({ ...f, quantity: e.target.value }))}
                  className="border px-2 py-1 w-16 text-xs rounded text-center"
                />
              </td>
              <td>
                <button
                  className="text-xs text-blue-700 font-semibold hover:underline"
                  onClick={addSeal}
                  title="Add Seal"
                >Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ModelComponentEditor;