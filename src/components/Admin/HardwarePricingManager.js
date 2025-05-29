import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

const HardwarePricingManager = () => {
  const [pricing, setPricing] = useState([]);
  const [hardwareTypes, setHardwareTypes] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [hardwareTypeId, setHardwareTypeId] = useState("");
  const [finishId, setFinishId] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/hardware-pricing`).then(r => setPricing(r.data));
    axios.get(`${API}/hardware-types`).then(r => setHardwareTypes(r.data));
    axios.get(`${API}/finishes`).then(r => setFinishes(r.data));
  }, [refresh]);

  const save = async () => {
    if (!hardwareTypeId || !finishId || price === "") return;
    const payload = {
      hardware_type_id: hardwareTypeId,
      finish_id: finishId,
      unit_price: parseFloat(price)
    };
    if (editing) {
      await axios.put(`${API}/hardware-pricing/${editing.id}`, payload, { withCredentials: true });
    } else {
      await axios.post(`${API}/hardware-pricing`, payload, { withCredentials: true });
    }
    setEditing(null);
    setHardwareTypeId("");
    setFinishId("");
    setPrice("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this price?")) {
      await axios.delete(`${API}/hardware-pricing/${id}`, { withCredentials: true });
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Hardware Type</th>
            <th>Finish</th>
            <th>Unit Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pricing.map(p => (
            <tr key={p.id}>
              <td>{p.hardware_type_name}</td>
              <td>{p.finish_name}</td>
              <td>{p.unit_price}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => {
                  setEditing(p);
                  setHardwareTypeId(p.hardware_type_id);
                  setFinishId(p.finish_id);
                  setPrice(p.unit_price);
                }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <select className="border px-1 py-0.5 text-xs w-full"
                value={hardwareTypeId}
                onChange={e => setHardwareTypeId(e.target.value)}>
                <option value="">Hardware type</option>
                {hardwareTypes.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </td>
            <td>
              <select className="border px-1 py-0.5 text-xs w-full"
                value={finishId}
                onChange={e => setFinishId(e.target.value)}>
                <option value="">Finish</option>
                {finishes.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </td>
            <td>
              <input className="border px-1 py-0.5 text-xs w-full"
                value={price}
                type="number"
                min="0"
                step="0.01"
                onChange={e => setPrice(e.target.value)}
                placeholder="Unit Price"
              />
            </td>
            <td>
              <button className="text-xs text-green-600" onClick={save}>{editing ? "Update" : "Add"}</button>
              {editing && <button className="text-xs text-gray-500 ml-2" onClick={() => {
                setEditing(null); setHardwareTypeId(""); setFinishId(""); setPrice("");
              }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HardwarePricingManager;