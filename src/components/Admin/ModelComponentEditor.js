import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

const ModelComponentEditor = ({ model, refreshModels }) => {
  // State for component lists
  const [glass, setGlass] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [seals, setSeals] = useState([]);
  // State for selection dropdowns (for adding new components)
  const [allGlassTypes, setAllGlassTypes] = useState([]);
  const [allThicknesses, setAllThicknesses] = useState([]);
  const [allHardwareTypes, setAllHardwareTypes] = useState([]);
  const [allFinishes, setAllFinishes] = useState([]);
  const [allSealTypes, setAllSealTypes] = useState([]);
  // Form state for adding
  const [glassForm, setGlassForm] = useState({ glass_type_id: "", thickness_id: "", quantity: 1 });
  const [hardwareForm, setHardwareForm] = useState({ hardware_type_id: "", finish_id: "", quantity: 1 });
  const [sealForm, setSealForm] = useState({ seal_type_id: "", quantity: 1 });

  // Fetch all options and current model components
  useEffect(() => {
    if (!model?.id) return;
    axios.get(`${API}/model-glass-components/${model.id}`).then(res => setGlass(res.data));
    axios.get(`${API}/model-hardware-components/${model.id}`).then(res => setHardware(res.data));
    axios.get(`${API}/model-seal-components/${model.id}`).then(res => setSeals(res.data));
  }, [model, refreshModels]);

  useEffect(() => {
    axios.get(`${API}/glass-types`).then(r => setAllGlassTypes(r.data));
    axios.get(`${API}/glass-thickness`).then(r => setAllThicknesses(r.data));
    axios.get(`${API}/hardware-types`).then(r => setAllHardwareTypes(r.data));
    axios.get(`${API}/finishes`).then(r => setAllFinishes(r.data));
    axios.get(`${API}/seal-types`).then(r => setAllSealTypes(r.data));
  }, []);

  // Handlers for adding components
  const addGlass = async () => {
    if (!glassForm.glass_type_id || !glassForm.thickness_id) return;
    await axios.post(`${API}/model-glass-components`, {
      ...glassForm,
      model_id: model.id,
      quantity: Number(glassForm.quantity) || 1,
    });
    setGlassForm({ glass_type_id: "", thickness_id: "", quantity: 1 });
    refreshModels();
  };

  const addHardware = async () => {
    if (!hardwareForm.hardware_type_id || !hardwareForm.finish_id) return;
    await axios.post(`${API}/model-hardware-components`, {
      ...hardwareForm,
      model_id: model.id,
      quantity: Number(hardwareForm.quantity) || 1,
    });
    setHardwareForm({ hardware_type_id: "", finish_id: "", quantity: 1 });
    refreshModels();
  };

  const addSeal = async () => {
    if (!sealForm.seal_type_id) return;
    await axios.post(`${API}/model-seal-components`, {
      ...sealForm,
      model_id: model.id,
      quantity: Number(sealForm.quantity) || 1,
    });
    setSealForm({ seal_type_id: "", quantity: 1 });
    refreshModels();
  };

  // Handlers for deleting components
  const delGlass = async (id) => {
    await axios.delete(`${API}/model-glass-components/${id}`);
    refreshModels();
  };
  const delHardware = async (id) => {
    await axios.delete(`${API}/model-hardware-components/${id}`);
    refreshModels();
  };
  const delSeal = async (id) => {
    await axios.delete(`${API}/model-seal-components/${id}`);
    refreshModels();
  };

  return (
    <div className="w-full mt-4">
      {/* GLASS COMPONENTS */}
      <div>
        <div className="font-bold mb-1">Glass Panels</div>
        <table className="w-full mb-2">
          <thead>
            <tr className="text-xs text-gray-500">
              <th>Type</th>
              <th>Thickness</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {glass.map(g => (
              <tr key={g.id}>
                <td>{g.glass_type}</td>
                <td>{g.thickness} mm</td>
                <td>{g.quantity}</td>
                <td>
                  <button className="text-xs text-red-600" onClick={() => delGlass(g.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  value={glassForm.glass_type_id}
                  onChange={e => setGlassForm(f => ({ ...f, glass_type_id: e.target.value }))}
                  className="border px-1 py-0.5 text-xs"
                >
                  <option value="">Type</option>
                  {allGlassTypes.map(gt => (
                    <option key={gt.id} value={gt.id}>{gt.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={glassForm.thickness_id}
                  onChange={e => setGlassForm(f => ({ ...f, thickness_id: e.target.value }))}
                  className="border px-1 py-0.5 text-xs"
                >
                  <option value="">Thickness</option>
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
                  className="border px-1 py-0.5 w-14 text-xs"
                />
              </td>
              <td>
                <button className="text-xs text-blue-600" onClick={addGlass}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* HARDWARE COMPONENTS */}
      <div className="mt-4">
        <div className="font-bold mb-1">Hardware</div>
        <table className="w-full mb-2">
          <thead>
            <tr className="text-xs text-gray-500">
              <th>Type</th>
              <th>Finish</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hardware.map(h => (
              <tr key={h.id}>
                <td>{h.hardware_type}</td>
                <td>{h.finish}</td>
                <td>{h.quantity}</td>
                <td>
                  <button className="text-xs text-red-600" onClick={() => delHardware(h.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  value={hardwareForm.hardware_type_id}
                  onChange={e => setHardwareForm(f => ({ ...f, hardware_type_id: e.target.value }))}
                  className="border px-1 py-0.5 text-xs"
                >
                  <option value="">Type</option>
                  {allHardwareTypes.map(ht => (
                    <option key={ht.id} value={ht.id}>{ht.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={hardwareForm.finish_id}
                  onChange={e => setHardwareForm(f => ({ ...f, finish_id: e.target.value }))}
                  className="border px-1 py-0.5 text-xs"
                >
                  <option value="">Finish</option>
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
                  className="border px-1 py-0.5 w-14 text-xs"
                />
              </td>
              <td>
                <button className="text-xs text-blue-600" onClick={addHardware}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* SEAL COMPONENTS */}
      <div className="mt-4">
        <div className="font-bold mb-1">Seals</div>
        <table className="w-full mb-2">
          <thead>
            <tr className="text-xs text-gray-500">
              <th>Type</th>
              <th>Quantity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {seals.map(s => (
              <tr key={s.id}>
                <td>{s.seal_type}</td>
                <td>{s.quantity}</td>
                <td>
                  <button className="text-xs text-red-600" onClick={() => delSeal(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <select
                  value={sealForm.seal_type_id}
                  onChange={e => setSealForm(f => ({ ...f, seal_type_id: e.target.value }))}
                  className="border px-1 py-0.5 text-xs"
                >
                  <option value="">Type</option>
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
                  className="border px-1 py-0.5 w-14 text-xs"
                />
              </td>
              <td>
                <button className="text-xs text-blue-600" onClick={addSeal}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelComponentEditor;