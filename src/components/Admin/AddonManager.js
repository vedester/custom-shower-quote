import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const AddonManager = () => {
  const [addons, setAddons] = useState([]);
  const [models, setModels] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [modelId, setModelId] = useState("");
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/addons`).then(r => setAddons(r.data));
    axios.get(`${API}/models`).then(r => setModels(r.data));
  }, [refresh]);

  const save = async () => {
    if (!name || price === "") return;
    const payload = { name, price: parseFloat(price), model_id: modelId || null };
    if (editing) {
      await axios.put(`${API}/addons/${editing.id}`, payload, { withCredentials: true });
    } else {
      await axios.post(`${API}/addons`, payload, { withCredentials: true });
    }
    setEditing(null);
    setName("");
    setPrice("");
    setModelId("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this addon?")) {
      await axios.delete(`${API}/addons/${id}`, { withCredentials: true });
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Add-Ons</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Name</th>
            <th>Price</th>
            <th>Model</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {addons.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.price}</td>
              <td>{models.find(m => m.id === a.model_id)?.name || "-"}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => {
                  setEditing(a);
                  setName(a.name);
                  setPrice(a.price);
                  setModelId(a.model_id || "");
                }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input className="border px-1 py-0.5 text-xs w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New addon"
              />
            </td>
            <td>
              <input className="border px-1 py-0.5 text-xs w-full"
                value={price}
                type="number"
                min="0"
                step="0.01"
                onChange={e => setPrice(e.target.value)}
                placeholder="Price"
              />
            </td>
            <td>
              <select className="border px-1 py-0.5 text-xs w-full"
                value={modelId}
                onChange={e => setModelId(e.target.value)}>
                <option value="">(None)</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </td>
            <td>
              <button className="text-xs text-green-600" onClick={save}>{editing ? "Update" : "Add"}</button>
              {editing && <button className="text-xs text-gray-500 ml-2" onClick={() => {
                setEditing(null); setName(""); setPrice(""); setModelId("");
              }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddonManager;