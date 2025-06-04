import React, { useEffect, useState } from "react";
import api from "./api";

const GlassThicknessManager = () => {
  const [thicknesses, setThicknesses] = useState([]);
  const [form, setForm] = useState({ thickness_mm: "" });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchThicknesses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/glass-thickness");
      setThicknesses(res.data);
    } catch (err) {
      setFeedback("Failed to fetch thickness.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThicknesses();
  }, []);

  const handleInputChange = (e) => {
    setForm({ thickness_mm: e.target.value });
  };

  const handleSave = async () => {
    if (!form.thickness_mm.trim() || isNaN(Number(form.thickness_mm))) {
      setFeedback("Thickness (mm) is required and must be a number.");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/glass-thickness/${editingId}`, {
          thickness_mm: parseInt(form.thickness_mm, 10),
        });
        setFeedback("Thickness updated.");
      } else {
        await api.post("/glass-thickness", {
          thickness_mm: parseInt(form.thickness_mm, 10),
        });
        setFeedback("Thickness added.");
      }
      setForm({ thickness_mm: "" });
      setEditingId(null);
      fetchThicknesses();
    } catch (err) {
      setFeedback("Failed to save thickness.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ thickness_mm: item.thickness_mm });
    setFeedback("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this thickness?")) return;
    setLoading(true);
    try {
      await api.delete(`/glass-thickness/${id}`);
      setFeedback("Thickness deleted.");
      fetchThicknesses();
      setForm({ thickness_mm: "" });
      setEditingId(null);
    } catch (err) {
      setFeedback("Failed to delete thickness.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Glass Thickness</h2>
      {feedback && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm ${
            feedback.toLowerCase().includes("fail")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          type="number"
          className="border rounded px-3 py-1 w-full text-sm"
          placeholder="Thickness (mm)"
          value={form.thickness_mm}
          onChange={handleInputChange}
          disabled={loading}
          min={1}
        />
        <button
          className={`text-sm px-4 py-2 rounded text-white ${
            editingId ? "bg-blue-600" : "bg-green-600"
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            className="text-sm px-3 py-2 rounded bg-gray-300 text-gray-800"
            onClick={() => {
              setForm({ thickness_mm: "" });
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
            <th className="text-left py-2">Thickness (mm)</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {thicknesses.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{item.thickness_mm} mm</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-3 hover:underline"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {thicknesses.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center py-4 text-gray-400">
                No thicknesses defined yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GlassThicknessManager;