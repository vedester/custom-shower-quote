import React, { useEffect, useState } from "react";
import api from "./api";

const HardwareTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hardware-types");
      setTypes(res.data);
    } catch {
      setFeedback("Failed to fetch hardware types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleInputChange = (e) => setForm({ name: e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFeedback("Name is required.");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/hardware-types/${editingId}`, { name: form.name.trim() });
        setFeedback("Hardware type updated.");
      } else {
        await api.post("/hardware-types", { name: form.name.trim() });
        setFeedback("Hardware type added.");
      }
      setForm({ name: "" });
      setEditingId(null);
      fetchTypes();
    } catch {
      setFeedback("Failed to save hardware type.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type) => {
    setForm({ name: type.name });
    setEditingId(type.id);
    setFeedback("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hardware type?")) return;
    setLoading(true);
    try {
      await api.delete(`/hardware-types/${id}`);
      setFeedback("Hardware type deleted.");
      setForm({ name: "" });
      setEditingId(null);
      fetchTypes();
    } catch {
      setFeedback("Failed to delete hardware type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
      <h2 className="font-bold text-lg mb-4">Hardware Types</h2>
      {feedback && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ${
          feedback.toLowerCase().includes("fail")
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>{feedback}</div>
      )}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          className="border rounded px-3 py-1 w-full text-sm"
          placeholder="Hardware type name"
          value={form.name}
          onChange={handleInputChange}
          disabled={loading}
        />
        <button
          className={`text-sm px-4 py-2 rounded text-white ${editingId ? "bg-blue-600" : "bg-green-600"}`}
          onClick={handleSave}
          disabled={loading}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            className="text-sm px-3 py-2 rounded bg-gray-300 text-gray-800"
            onClick={() => {
              setForm({ name: "" });
              setEditingId(null);
              setFeedback("");
            }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            <th className="text-left py-2">Type Name</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => (
            <tr key={type.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{type.name}</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-3 hover:underline"
                  onClick={() => handleEdit(type)}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => handleDelete(type.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {types.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center py-4 text-gray-400">
                No hardware types defined yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HardwareTypeManager;