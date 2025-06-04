import React, { useEffect, useState } from "react";
import api from "./api";

const GlassPricingManager = () => {
  const [glassTypes, setGlassTypes] = useState([]);
  const [thicknesses, setThicknesses] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [form, setForm] = useState({
    glass_type_id: "",
    thickness_id: "",
    price_per_m2: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [typesRes, thicknessesRes, pricingRes] = await Promise.all([
        api.get("/glass-types"),
        api.get("/glass-thickness"),
        api.get("/glass-pricing"),
      ]);
      setGlassTypes(typesRes.data);
      setThicknesses(thicknessesRes.data);
      setPricing(pricingRes.data);
    } catch (err) {
      setFeedback("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.glass_type_id || !form.thickness_id || !form.price_per_m2) {
      setFeedback("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        glass_type_id: parseInt(form.glass_type_id, 10),
        thickness_id: parseInt(form.thickness_id, 10),
        price_per_m2: parseFloat(form.price_per_m2),
      };
      if (editingId) {
        await api.put(`/glass-pricing/${editingId}`, payload);
        setFeedback("Price updated.");
      } else {
        await api.post("/glass-pricing", payload);
        setFeedback("Price added.");
      }
      setForm({ glass_type_id: "", thickness_id: "", price_per_m2: "" });
      setEditingId(null);
      fetchAllData();
    } catch (err) {
      setFeedback("Failed to save price.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      glass_type_id: item.glass_type_id.toString(),
      thickness_id: item.thickness_id.toString(),
      price_per_m2: item.price_per_m2.toString(),
    });
    setFeedback("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this price entry?")) return;
    setLoading(true);
    try {
      await api.delete(`/glass-pricing/${id}`);
      setFeedback("Price entry deleted.");
      fetchAllData();
      setForm({ glass_type_id: "", thickness_id: "", price_per_m2: "" });
      setEditingId(null);
    } catch (err) {
      setFeedback("Failed to delete price entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-2xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Glass Pricing</h2>
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

      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            <th className="text-left py-2">Glass Type</th>
            <th className="text-left py-2">Thickness</th>
            <th className="text-left py-2">Price (per m²)</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pricing.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{item.glass_type}</td>
              <td className="py-2">{item.thickness_mm} mm</td>
              <td className="py-2">₪{item.price_per_m2}</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-2 hover:underline"
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
          {pricing.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                No pricing entries defined yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add/Edit Form */}
      <div className="flex gap-3 mb-4">
        <select
          name="glass_type_id"
          className="border rounded px-3 py-1 w-1/3 text-sm"
          value={form.glass_type_id}
          onChange={handleInputChange}
          disabled={loading}
        >
          <option value="">-- Glass Type --</option>
          {glassTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          name="thickness_id"
          className="border rounded px-3 py-1 w-1/3 text-sm"
          value={form.thickness_id}
          onChange={handleInputChange}
          disabled={loading}
        >
          <option value="">-- Thickness --</option>
          {thicknesses.map((th) => (
            <option key={th.id} value={th.id}>
              {th.thickness_mm} mm
            </option>
          ))}
        </select>
        <input
          type="number"
          name="price_per_m2"
          className="border rounded px-3 py-1 w-1/3 text-sm"
          placeholder="Price per m²"
          value={form.price_per_m2}
          onChange={handleInputChange}
          disabled={loading}
          min={0}
        />
      </div>
      <div className="flex gap-2">
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
            className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-700"
            onClick={() => {
              setForm({ glass_type_id: "", thickness_id: "", price_per_m2: "" });
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

export default GlassPricingManager;