import React, { useEffect, useState } from "react";
import api from "./api";

const SealPricingManager = () => {
  const [sealPricing, setSealPricing] = useState([]);
  const [form, setForm] = useState({
    seal_type: "",
    finish: "",
    quantity: 1,
    unit_price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const pricingRes = await api.get("/seal-pricing");
      setSealPricing(pricingRes.data);
    } catch {
      setFeedback("Failed to fetch seal pricing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPricing(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!form.seal_type.trim() || !form.finish.trim() || !form.unit_price || form.quantity < 1) {
      setFeedback("Please fill all fields correctly.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        seal_type: form.seal_type,
        finish: form.finish,
        quantity: Number(form.quantity),
        unit_price: parseFloat(form.unit_price),
      };
      if (editingId) {
        await api.put(`/seal-pricing/${editingId}`, payload);
        setFeedback("Seal pricing updated.");
      } else {
        await api.post("/seal-pricing", payload);
        setFeedback("Seal pricing added.");
      }
      setForm({ seal_type: "", finish: "", quantity: 1, unit_price: "" });
      setEditingId(null);
      fetchPricing();
    } catch {
      setFeedback("Failed to save seal pricing.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      seal_type: item.seal_type || "",
      finish: item.finish || "",
      quantity: item.quantity || 1,
      unit_price: item.unit_price ? item.unit_price.toString() : "",
    });
    setFeedback("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this seal price entry?")) return;
    setLoading(true);
    try {
      await api.delete(`/seal-pricing/${id}`);
      setFeedback("Seal price entry deleted.");
      setForm({ seal_type: "", finish: "", quantity: 1, unit_price: "" });
      setEditingId(null);
      fetchPricing();
    } catch {
      setFeedback("Failed to delete seal price entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
      <h2 className="font-bold text-lg mb-4">Seal Pricing</h2>
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
              <th className="py-2 px-3 text-left">Seal Type</th>
              <th className="py-2 px-3 text-left">Finish</th>
              <th className="py-2 px-3 text-left">Quantity</th>
              <th className="py-2 px-3 text-left">Unit Price</th>
              <th className="py-2 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sealPricing.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{item.seal_type}</td>
                <td className="py-2 px-3">{item.finish}</td>
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
            {sealPricing.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No seal pricing entries defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          name="seal_type"
          type="text"
          className="border rounded px-3 py-1 flex-1 min-w-[130px] text-sm"
          placeholder="Seal type"
          value={form.seal_type}
          onChange={handleInputChange}
          disabled={loading}
        />
        <input
          name="finish"
          type="text"
          className="border rounded px-3 py-1 flex-1 min-w-[110px] text-sm"
          placeholder="Finish"
          value={form.finish}
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
              setForm({ seal_type: "", finish: "", quantity: 1, unit_price: "" });
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

export default SealPricingManager;