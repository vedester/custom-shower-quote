import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

const HardwareTypeManager = () => {
  const [hardwareTypes, setHardwareTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/hardware-types`).then(r => setHardwareTypes(r.data));
  }, [refresh]);

  const save = async () => {
    if (!name) return;
    if (editing) {
      await axios.put(`${API}/hardware-types/${editing.id}`, { name });
    } else {
      await axios.post(`${API}/hardware-types`, { name });
    }
    setEditing(null);
    setName("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this hardware type?")) {
      await axios.delete(`${API}/hardware-types/${id}`);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Hardware Types</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {hardwareTypes.map(ht => (
            <tr key={ht.id}>
              <td>{ht.name}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => { setEditing(ht); setName(ht.name); }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(ht.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="border px-1 py-0.5 text-xs w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New hardware type"
              />
            </td>
            <td>
              <button className="text-xs text-green-600" onClick={save}>{editing ? "Update" : "Add"}</button>
              {editing && <button className="text-xs text-gray-500 ml-2" onClick={() => { setEditing(null); setName(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HardwareTypeManager;