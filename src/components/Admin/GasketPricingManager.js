import React, { useEffect, useState } from "react";
import api from "./api";

const GasketPricingManager = () => {
  const [gasketPricing, setGasketPricing] = useState([]);
  const [form, setForm] = useState({
    gasket_type: "",
    color: "",
    quantity: 1,
    unit_price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch gasket pricing table
  const fetchPricing = async () => {
    setLoading(true);
    try {
      const pricingRes = await api.get("/gasket-pricing");
      setGasketPricing(pricingRes.data);
    } catch {
      setFeedback("Failed to fetch gasket pricing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  // Handle changes in form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  // Save (add or update) gasket pricing row
  const handleSave = async () => {
    if (!form.gasket_type.trim() || !form.color.trim() || !form.unit_price || form.quantity < 1) {
      setFeedback("Please fill all fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        gasket_type: form.gasket_type,
        color: form.color,
        quantity: Number(form.quantity),
        unit_price: parseFloat(form.unit_price),
      };
      if (editingId) {
        await api.put(`/gasket-pricing/${editingId}`, payload);
        setFeedback("Gasket pricing updated.");
      } else {
        await api.post("/gasket-pricing", payload);
        setFeedback("Gasket pricing added.");
      }
      setForm({ gasket_type: "", color: "", quantity: 1, unit_price: "" });
      setEditingId(null);
      fetchPricing();
    } catch {
      setFeedback("Failed to save gasket pricing.");
    } finally {
      setLoading(false);
    }
  };

  // Populate form for editing
  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      gasket_type: item.gasket_type || "",
      color: item.color || "",
      quantity: item.quantity || 1,
      unit_price: item.unit_price ? item.unit_price.toString() : "",
    });
    setFeedback("");
  };

  // Delete a gasket pricing entry
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gasket price entry?")) return;
    setLoading(true);
    try {
      await api.delete(`/gasket-pricing/${id}`);
      setFeedback("Gasket price entry deleted.");
      setForm({ gasket_type: "", color: "", quantity: 1, unit_price: "" });
      setEditingId(null);
      fetchPricing();
    } catch {
      setFeedback("Failed to delete gasket price entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Gasket Pricing</h2>
      {feedback && (
        <div className={`mb-4 px-4 py-2 rounded text-sm ${
          feedback.toLowerCase().includes("fail")
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}>{feedback}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm mb-4">
          <thead>
            <tr className="text-xs text-gray-700 border-b bg-gray-100">
              <th className="py-2 px-3 text-left">Gasket Type</th>
              <th className="py-2 px-3 text-left">Color</th>
              <th className="py-2 px-3 text-left">Quantity</th>
              <th className="py-2 px-3 text-left">Unit Price</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gasketPricing.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{item.gasket_type}</td>
                <td className="py-2 px-3">{item.color}</td>
                <td className="py-2 px-3">{item.quantity}</td>
                <td className="py-2 px-3">{item.unit_price}</td>
                <td className="py-2 px-3 text-right">
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
            {gasketPricing.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No gasket pricing entries defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          name="gasket_type"
          type="text"
          className="border rounded px-3 py-1 flex-1 min-w-[130px] text-sm"
          placeholder="Gasket type"
          value={form.gasket_type}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          name="color"
          type="text"
          className="border rounded px-3 py-1 flex-1 min-w-[110px] text-sm"
          placeholder="Color"
          value={form.color}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          name="quantity"
          type="number"
          className="border rounded px-3 py-1 w-24 text-sm"
          placeholder="Qty"
          value={form.quantity}
          min={1}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          name="unit_price"
          type="number"
          className="border rounded px-3 py-1 w-32 text-sm"
          placeholder="Unit Price"
          value={form.unit_price}
          min={0}
          step="0.01"
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>
      <div className="flex gap-2">
        <button
          className={`text-sm px-5 py-2 rounded text-white ${
            editingId ? "bg-blue-600" : "bg-green-600"
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            className="text-sm px-5 py-2 rounded bg-gray-200 text-gray-700"
            onClick={() => {
              setForm({ gasket_type: "", color: "", quantity: 1, unit_price: "" });
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

export default GasketPricingManager;