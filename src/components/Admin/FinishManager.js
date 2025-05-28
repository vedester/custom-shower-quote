import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const FinishManager = () => {
  const [finishes, setFinishes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/finishes`).then(r => setFinishes(r.data));
  }, [refresh]);

  const save = async () => {
    if (!name) return;
    if (editing) {
      await axios.put(`${API}/finishes/${editing.id}`, { name });
    } else {
      await axios.post(`${API}/finishes`, { name });
    }
    setEditing(null);
    setName("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this finish?")) {
      await axios.delete(`${API}/finishes/${id}`);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Finishes</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {finishes.map(f => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => { setEditing(f); setName(f.name); }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(f.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="border px-1 py-0.5 text-xs w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New finish"
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

export default FinishManager;