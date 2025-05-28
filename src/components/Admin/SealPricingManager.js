import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const SealPricingManager = () => {
  const [pricing, setPricing] = useState([]);
  const [sealTypes, setSealTypes] = useState([]);
  const [sealTypeId, setSealTypeId] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/seal-pricing`).then(r => setPricing(r.data));
    axios.get(`${API}/seal-types`).then(r => setSealTypes(r.data));
  }, [refresh]);

  const save = async () => {
    if (!sealTypeId || price === "") return;
    const payload = {
      seal_type_id: sealTypeId,
      unit_price: parseFloat(price)
    };
    if (editing) {
      await axios.put(`${API}/seal-pricing/${editing.id}`, payload, { withCredentials: true });
    } else {
      await axios.post(`${API}/seal-pricing`, payload, { withCredentials: true });
    }
    setEditing(null);
    setSealTypeId("");
    setPrice("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this price?")) {
      await axios.delete(`${API}/seal-pricing/${id}`, { withCredentials: true });
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Seal Type</th>
            <th>Unit Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pricing.map(p => (
            <tr key={p.id}>
              <td>{p.seal_type_name}</td>
              <td>{p.unit_price}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => {
                  setEditing(p);
                  setSealTypeId(p.seal_type_id);
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
                value={sealTypeId}
                onChange={e => setSealTypeId(e.target.value)}>
                <option value="">Seal type</option>
                {sealTypes.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
                setEditing(null); setSealTypeId(""); setPrice("");
              }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SealPricingManager;