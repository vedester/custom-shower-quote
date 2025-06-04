import React, { useEffect, useState } from "react";
import api from "./api";

const SealTypeManager = () => {
  const [sealTypes, setSealTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSealTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/seal-types");
      setSealTypes(res.data);
    } catch {
      setFeedback("Failed to fetch seal types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSealTypes();
  }, []);

  const save = async () => {
    if (!name) {
      setFeedback("Seal type name is required.");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/seal-types/${editing.id}`, { name });
        setFeedback("Seal type updated.");
      } else {
        await api.post("/seal-types", { name });
        setFeedback("Seal type added.");
      }
      setEditing(null);
      setName("");
      fetchSealTypes();
    } catch {
      setFeedback("Failed to save seal type.");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    if (window.confirm("Delete this seal type?")) {
      setLoading(true);
      try {
        await api.delete(`/seal-types/${id}`);
        setFeedback("Seal type deleted.");
        fetchSealTypes();
      } catch {
        setFeedback("Failed to delete seal type.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
      <h2 className="font-bold text-lg mb-4">Seal Types</h2>
      {feedback && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ${
          feedback.toLowerCase().includes("fail") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>
          {feedback}
        </div>
      )}
      <table className="w-full mb-2 text-sm">
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sealTypes.map(st => (
            <tr key={st.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{st.name}</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-3 hover:underline"
                  onClick={() => { setEditing(st); setName(st.name); setFeedback(""); }}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => del(st.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="border px-1 py-0.5 text-xs w-full"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Add new seal type"
                disabled={loading}
              />
            </td>
            <td className="text-right">
              <button
                className="text-xs text-green-600 ml-2"
                onClick={save}
                disabled={loading}
              >
                {editing ? "Update" : "Add"}
              </button>
              {editing && (
                <button
                  className="text-xs text-gray-500 ml-2"
                  onClick={() => { setEditing(null); setName(""); setFeedback(""); }}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SealTypeManager;