

import React, { useEffect, useState } from "react";
import api from "./api";

const HardwarePricingManager = () => {
  const [hardwareTypes, setHardwareTypes] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [form, setForm] = useState({
    hardware_type_id: "",
    finish_id: "",
    unit_price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [typesRes, finishesRes, pricingRes] = await Promise.all([
        api.get("/hardware-types"),
        api.get("/finishes"),
        api.get("/hardware-pricing"),
      ]);
      setHardwareTypes(typesRes.data);
      setFinishes(finishesRes.data);
      setPricing(pricingRes.data);
    } catch {
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.hardware_type_id || !form.finish_id || !form.unit_price) {
      setFeedback("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        hardware_type_id: parseInt(form.hardware_type_id, 10),
        finish_id: parseInt(form.finish_id, 10),
        unit_price: parseFloat(form.unit_price),
      };
      if (editingId) {
        await api.put(`/hardware-pricing/₪{editingId}`, payload);
        setFeedback("Price updated.");
      } else {
        await api.post("/hardware-pricing", payload);
        setFeedback("Price added.");
      }
      setForm({ hardware_type_id: "", finish_id: "", unit_price: "" });
      setEditingId(null);
      fetchAllData();
    } catch {
      setFeedback("Failed to save price.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      hardware_type_id: item.hardware_type_id.toString(),
      finish_id: item.finish_id.toString(),
      unit_price: item.unit_price.toString(),
    });
    setFeedback("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this price entry?")) return;
    setLoading(true);
    try {
      await api.delete(`/hardware-pricing/₪{id}`);
      setFeedback("Price entry deleted.");
      setForm({ hardware_type_id: "", finish_id: "", unit_price: "" });
      setEditingId(null);
      fetchAllData();
    } catch {
      setFeedback("Failed to delete price entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Hardware Pricing</h2>
      {feedback && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ₪{
          feedback.toLowerCase().includes("fail")
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>{feedback}</div>
      )}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            <th className="text-left py-2">Hardware Type</th>
            <th className="text-left py-2">Finish</th>
            <th className="text-left py-2">Price</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pricing.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{item.hardware_type}</td>
              <td className="py-2">{item.finish}</td>
              <td className="py-2">₪{item.unit_price}</td>
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
          name="hardware_type_id"
          className="border rounded px-3 py-1 w-1/3 text-sm"
          value={form.hardware_type_id}
          onChange={handleInputChange}
          disabled={loading}
        >
          <option value="">-- Hardware Type --</option>
          {hardwareTypes.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <select
          name="finish_id"
          className="border rounded px-3 py-1 w-1/3 text-sm"
          value={form.finish_id}
          onChange={handleInputChange}
          disabled={loading}
        >
          <option value="">-- Finish --</option>
          {finishes.map((finish) => (
            <option key={finish.id} value={finish.id}>{finish.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="unit_price"
          className="border rounded px-3 py-1 w-1/3 text-sm"
          placeholder="Unit Price"
          value={form.unit_price}
          onChange={handleInputChange}
          disabled={loading}
          min={0}
        />
      </div>
      <div className="flex gap-2">
        <button
          className={`text-sm px-4 py-2 rounded text-white ₪{
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
              setForm({ hardware_type_id: "", finish_id: "", unit_price: "" });
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

export default HardwarePricingManager;