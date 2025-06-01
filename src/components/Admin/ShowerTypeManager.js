import React, { useEffect, useState } from "react";
import api from "./api";

const ShowerTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/shower-types");
      setTypes(res.data);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to fetch shower types.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setFeedback("Shower type name is required.");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        const res = await api.put(`/shower-types/${editingId}`, { name: trimmed });
        setTypes(prev => prev.map(t => (t.id === editingId ? res.data : t)));
        setFeedback("Shower type updated.");
      } else {
        const res = await api.post("/shower-types", { name: trimmed });
        setTypes(prev => [...prev, res.data]);
        setFeedback("Shower type added.");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setFeedback("Failed to save shower type.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this shower type?")) return;

    setLoading(true);
    try {
      await api.delete(`/shower-types/${id}`);
      setTypes(prev => prev.filter(t => t.id !== id));
      setFeedback("Shower type deleted.");
      if (editingId === id) resetForm();
    } catch (err) {
      console.error(err);
      setFeedback("Failed to delete shower type.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
    setFeedback("");
  };

  const isError = feedback.toLowerCase().includes("fail");

  return (
    <div className="bg-white shadow rounded p-6 max-w-xl mx-auto relative">
      <h2 className="font-bold text-lg mb-4">Manage Shower Types</h2>

      {feedback && (
        <div className={`mb-4 px-4 py-2 text-sm rounded ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {feedback}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
          <span className="text-sm text-gray-500">Processing...</span>
        </div>
      )}

      <table className={`w-full text-sm ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        <thead>
          <tr className="border-b text-gray-600">
            <th className="text-left py-2">Name</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map(t => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{t.name}</td>
              <td className="py-2 text-right">
                <button
                  className="text-blue-600 text-xs hover:underline mr-2"
                  onClick={() => {
                    setEditingId(t.id);
                    setName(t.name);
                    setFeedback("");
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 text-xs hover:underline"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                className="border rounded px-2 py-1 w-full mt-2"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New shower type"
                onKeyDown={e => e.key === "Enter" && handleSave()}
                disabled={loading}
              />
            </td>
            <td className="text-right pt-2">
              <button
                className={`px-3 py-1 text-xs text-white rounded mr-2 ${
                  editingId ? "bg-blue-600" : "bg-green-600"
                }`}
                onClick={handleSave}
                disabled={loading}
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-700"
                  onClick={resetForm}
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

export default ShowerTypeManager;
