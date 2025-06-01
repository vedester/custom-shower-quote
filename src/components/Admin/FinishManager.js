import React, { useEffect, useState } from "react";
import api from "./api";

const FinishManager = () => {
  const [finishes, setFinishes] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFinishes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/finishes");
      setFinishes(res.data);
    } catch {
      setFeedback("Failed to fetch finishes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinishes();
  }, []);

  const handleInputChange = (e) => setForm({ name: e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFeedback("Name required.");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/finishes/${editingId}`, { name: form.name.trim() });
        setFeedback("Finish updated.");
      } else {
        await api.post("/finishes", { name: form.name.trim() });
        setFeedback("Finish added.");
      }
      setForm({ name: "" });
      setEditingId(null);
      fetchFinishes();
    } catch {
      setFeedback("Failed to save finish.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (finish) => {
    setForm({ name: finish.name });
    setEditingId(finish.id);
    setFeedback("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this finish?")) return;
    setLoading(true);
    try {
      await api.delete(`/finishes/${id}`);
      setFeedback("Finish deleted.");
      setForm({ name: "" });
      setEditingId(null);
      fetchFinishes();
    } catch {
      setFeedback("Failed to delete finish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
      <h2 className="font-bold text-lg mb-4">Hardware Finishes</h2>
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
          placeholder="Finish name"
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
            <th className="text-left py-2">Finish Name</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {finishes.map((finish) => (
            <tr key={finish.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{finish.name}</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-3 hover:underline"
                  onClick={() => handleEdit(finish)}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => handleDelete(finish.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {finishes.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center py-4 text-gray-400">
                No finishes defined yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinishManager;