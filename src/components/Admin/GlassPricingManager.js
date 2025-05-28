import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const GlassPricingManager = () => {
  const [pricing, setPricing] = useState([]);
  const [glassTypes, setGlassTypes] = useState([]);
  const [thicknesses, setThicknesses] = useState([]);
  const [glassTypeId, setGlassTypeId] = useState("");
  const [thicknessId, setThicknessId] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/glass-pricing`).then(r => setPricing(r.data));
    axios.get(`${API}/glass-types`).then(r => setGlassTypes(r.data));
    axios.get(`${API}/glass-thickness`).then(r => setThicknesses(r.data));
  }, [refresh]);

  const save = async () => {
    if (!glassTypeId || !thicknessId || price === "") return;
    const payload = {
      glass_type_id: glassTypeId,
      thickness_id: thicknessId,
      price_per_m2: parseFloat(price)
    };
    if (editing) {
      await axios.put(`${API}/glass-pricing/${editing.id}`, payload, { withCredentials: true });
    } else {
      await axios.post(`${API}/glass-pricing`, payload, { withCredentials: true });
    }
    setEditing(null);
    setGlassTypeId("");
    setThicknessId("");
    setPrice("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this price?")) {
      await axios.delete(`${API}/glass-pricing/${id}`, { withCredentials: true });
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Glass Type</th>
            <th>Thickness</th>
            <th>Price/m²</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pricing.map(p => (
            <tr key={p.id}>
              <td>{p.glass_type_name}</td>
              <td>{p.thickness_mm} mm</td>
              <td>{p.price_per_m2}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => {
                  setEditing(p);
                  setGlassTypeId(p.glass_type_id);
                  setThicknessId(p.thickness_id);
                  setPrice(p.price_per_m2);
                }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <select className="border px-1 py-0.5 text-xs w-full"
                value={glassTypeId}
                onChange={e => setGlassTypeId(e.target.value)}>
                <option value="">Glass type</option>
                {glassTypes.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </td>
            <td>
              <select className="border px-1 py-0.5 text-xs w-full"
                value={thicknessId}
                onChange={e => setThicknessId(e.target.value)}>
                <option value="">Thickness</option>
                {thicknesses.map(t => (
                  <option key={t.id} value={t.id}>{t.thickness_mm} mm</option>
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
                placeholder="Price/m²"
              />
            </td>
            <td>
              <button className="text-xs text-green-600" onClick={save}>{editing ? "Update" : "Add"}</button>
              {editing && <button className="text-xs text-gray-500 ml-2" onClick={() => {
                setEditing(null); setGlassTypeId(""); setThicknessId(""); setPrice("");
              }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GlassPricingManager;