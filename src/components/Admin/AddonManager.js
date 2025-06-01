import React, { useEffect, useState } from "react";
import api from "./api";

const AddonManager = () => {
  const [addons, setAddons] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAddons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/addons");
      setAddons(res.data);
    } catch {
      setFeedback("Failed to fetch add-ons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      setFeedback("Add-on name and price are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price)
      };
      if (editingId) {
        await api.put(`/addons/${editingId}`, payload);
        setFeedback("Add-on updated.");
      } else {
        await api.post("/addons", payload);
        setFeedback("Add-on added.");
      }
      setForm({ name: "", description: "", price: "" });
      setEditingId(null);
      fetchAddons();
    } catch {
      setFeedback("Failed to save add-on.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = addon => {
    setEditingId(addon.id);
    setForm({
      name: addon.name,
      description: addon.description || "",
      price: addon.price.toString()
    });
    setFeedback("");
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this add-on?")) return;
    setLoading(true);
    try {
      await api.delete(`/addons/${id}`);
      setFeedback("Add-on deleted.");
      setForm({ name: "", description: "", price: "" });
      setEditingId(null);
      fetchAddons();
    } catch {
      setFeedback("Failed to delete add-on.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-2xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Manage Add-ons</h2>
      {feedback && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ${
          feedback.toLowerCase().includes("fail") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}>{feedback}</div>
      )}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            <th className="text-left py-2">Name</th>
            <th className="text-left py-2">Description</th>
            <th className="text-left py-2">Price</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {addons.map(addon => (
            <tr key={addon.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{addon.name}</td>
              <td className="py-2">{addon.description}</td>
              <td className="py-2">₪{addon.price}</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-2 hover:underline"
                  onClick={() => handleEdit(addon)}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => handleDelete(addon.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {addons.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-400">No add-ons defined yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Add/Edit Form */}
      <div className="flex flex-col gap-2 mb-2">
        <input
          type="text"
          name="name"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Add-on Name"
          value={form.name}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          type="text"
          name="description"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          type="number"
          name="price"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          disabled={loading}
          min={0}
        />
      </div>
      <div className="flex gap-2">
        <button
          className={`text-sm px-4 py-2 rounded text-white ${editingId ? "bg-blue-600" : "bg-green-600"}`}
          onClick={handleSave}
          disabled={loading}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-700"
            onClick={() => {
              setForm({ name: "", description: "", price: "" });
              setEditingId(null);
              setFeedback("");
            }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AddonManager;