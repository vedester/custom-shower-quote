import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

const GlassThicknessManager = () => {
  const [thicknesses, setThicknesses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [thickness, setThickness] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/glass-thickness`).then(r => setThicknesses(r.data));
  }, [refresh]);

  const save = async () => {
    if (!thickness) return;
    if (editing) {
      await axios.put(`${API}/glass-thickness/${editing.id}`, { thickness_mm: thickness });
    } else {
      await axios.post(`${API}/glass-thickness`, { thickness_mm: thickness });
    }
    setEditing(null);
    setThickness("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this glass thickness?")) {
      await axios.delete(`${API}/glass-thickness/${id}`);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Glass Thicknesses (mm)</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Thickness</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {thicknesses.map(t => (
            <tr key={t.id}>
              <td>{t.thickness_mm}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => { setEditing(t); setThickness(t.thickness_mm); }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="border px-1 py-0.5 text-xs w-full"
                value={thickness}
                onChange={e => setThickness(e.target.value)}
                placeholder="e.g. 6"
                type="number"
                min="1"
              />
            </td>
            <td>
              <button className="text-xs text-green-600" onClick={save}>{editing ? "Update" : "Add"}</button>
              {editing && <button className="text-xs text-gray-500 ml-2" onClick={() => { setEditing(null); setThickness(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GlassThicknessManager;