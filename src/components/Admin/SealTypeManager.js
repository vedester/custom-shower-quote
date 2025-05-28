import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const SealTypeManager = () => {
  const [sealTypes, setSealTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/seal-types`).then(r => setSealTypes(r.data));
  }, [refresh]);

  const save = async () => {
    if (!name) return;
    if (editing) {
      await axios.put(`${API}/seal-types/${editing.id}`, { name });
    } else {
      await axios.post(`${API}/seal-types`, { name });
    }
    setEditing(null);
    setName("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this seal type?")) {
      await axios.delete(`${API}/seal-types/${id}`);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Seal Types</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sealTypes.map(st => (
            <tr key={st.id}>
              <td>{st.name}</td>
              <td>
                <button className="text-xs text-blue-600" onClick={() => { setEditing(st); setName(st.name); }}>Edit</button>
                {" "}
                <button className="text-xs text-red-600" onClick={() => del(st.id)}>Delete</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="border px-1 py-0.5 text-xs w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New seal type"
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

export default SealTypeManager;