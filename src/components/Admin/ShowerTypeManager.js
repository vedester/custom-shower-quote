import React, { useEffect, useState, useRef } from "react";
import api from "./api";

const IMAGE_BASE_URL =
  process.env.REACT_APP_IMAGE_BASE_URL || "http://127.0.0.1:5000";

// Only used by admin, so we don't need dimensions in admin form.
const DEFAULT_FORM = {
  name: "",
  description: "",
  profit_margin: "0.2",
  vat_rate: "0.18",
  needs_custom_quote: false,
  image: null,
};

const ShowerTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

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
    const trimmed = form.name.trim();
    if (!trimmed) {
      setFeedback("Shower type name is required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: trimmed,
        description: form.description.trim(),
        profit_margin: parseFloat(form.profit_margin),
        vat_rate: parseFloat(form.vat_rate),
        needs_custom_quote: !!form.needs_custom_quote,
      };

      let showerTypeRes;
      // If editing, update; else, create new
      if (editingId) {
        showerTypeRes = await api.put(`/shower-types/${editingId}`, payload);
        setTypes((prev) => prev.map((t) => (t.id === editingId ? showerTypeRes.data : t)));
        setFeedback("Shower type updated.");
      } else {
        showerTypeRes = await api.post("/shower-types", payload);
        setTypes((prev) => [...prev, showerTypeRes.data]);
        setFeedback("Shower type added.");
      }

      // If image is selected, upload it and update preview to new image
      if (form.image) {
        const formData = new FormData();
        formData.append("image", form.image);
        const imgRes = await api.post(
          `/shower-types/${editingId || showerTypeRes.data.id}/upload-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setTypes((prev) =>
          prev.map((t) =>
            t.id === (editingId || showerTypeRes.data.id) ? imgRes.data : t
          )
        );
        setFeedback((prev) => prev + " Image uploaded.");
        setImagePreview(imgRes.data.image_path ? IMAGE_BASE_URL + imgRes.data.image_path : null);
      }

      resetForm();
      fetchTypes();
    } catch (err) {
      console.error(err);
      setFeedback("Failed to save shower type.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shower type?")) return;
    setLoading(true);
    try {
      await api.delete(`/shower-types/${id}`);
      setTypes((prev) => prev.filter((t) => t.id !== id));
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
    setForm({ ...DEFAULT_FORM });
    setEditingId(null);
    setFeedback("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((f) => ({ ...f, image: file }));
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const isError = feedback.toLowerCase().includes("fail");

  // Use image_path or image_url, fallback to preview if just uploaded
  const getTypeImage = (t) => {
    if (t.image_path) return IMAGE_BASE_URL + t.image_path;
    if (t.image_url) return t.image_url;
    return null;
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto relative">
      <h2 className="font-bold text-2xl mb-6 text-blue-700 flex items-center gap-3">
        <span>
          <svg width="28" height="28" className="inline mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
        </span>
        Manage Shower Types
      </h2>

      {feedback && (
        <div className={`mb-4 px-4 py-2 text-sm rounded shadow-sm ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {feedback}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <span className="text-lg text-blue-700 font-semibold">Processing...</span>
        </div>
      )}

      <div className="overflow-x-auto border rounded-lg">
        <table className={`w-full text-sm bg-white ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          <thead>
            <tr className="border-b text-gray-700 bg-gray-50">
              <th className="text-left py-2 px-2 font-semibold">Image</th>
              <th className="text-left py-2 px-2 font-semibold">Name</th>
              <th className="text-left py-2 px-2 font-semibold">Description</th>
              <th className="text-left py-2 px-2 font-semibold">Profit Margin</th>
              <th className="text-left py-2 px-2 font-semibold">VAT Rate</th>
              <th className="text-left py-2 px-2 font-semibold">Custom Quote?</th>
              <th className="text-right py-2 px-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((t) => (
              <tr key={t.id} className="border-b hover:bg-blue-50 transition">
                <td className="py-2 px-2">
                  {getTypeImage(t) ? (
                    <img
                      src={getTypeImage(t)}
                      alt={t.name}
                      className="h-12 w-16 object-contain rounded shadow"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="py-2 px-2 font-semibold">{t.name}</td>
                <td className="py-2 px-2">{t.description || <span className="text-gray-300">—</span>}</td>
                <td className="py-2 px-2">{t.profit_margin != null ? `${(t.profit_margin * 100).toFixed(0)}%` : "-"}</td>
                <td className="py-2 px-2">{t.vat_rate != null ? `${(t.vat_rate * 100).toFixed(0)}%` : "-"}</td>
                <td className="py-2 px-2">{t.needs_custom_quote ? "Yes" : "No"}</td>
                <td className="py-2 px-2 text-right">
                  <button
                    className="text-blue-600 text-xs hover:underline mr-2"
                    onClick={() => {
                      setEditingId(t.id);
                      setForm({
                        name: t.name,
                        description: t.description || "",
                        profit_margin: t.profit_margin != null ? t.profit_margin.toString() : "0.2",
                        vat_rate: t.vat_rate != null ? t.vat_rate.toString() : "0.18",
                        needs_custom_quote: !!t.needs_custom_quote,
                        image: null,
                      });
                      setImagePreview(getTypeImage(t));
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

            {/* Add/Edit Form */}
            <tr className="bg-gray-50">
              <td className="py-2 px-2">
                <div className="flex flex-col items-center gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="block text-xs"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-10 w-14 object-contain mt-1 rounded border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  )}
                </div>
              </td>
              <td className="py-2 px-2">
                <input
                  className="border rounded px-2 py-1 w-full mt-2"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Name"
                  maxLength={128}
                  onKeyDown={e => e.key === "Enter" && handleSave()}
                  disabled={loading}
                />
              </td>
              <td className="py-2 px-2">
                <input
                  className="border rounded px-2 py-1 w-full mt-2"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                  maxLength={255}
                  disabled={loading}
                />
              </td>
              <td className="py-2 px-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="border rounded px-2 py-1 w-full mt-2"
                  value={form.profit_margin}
                  onChange={e => setForm(f => ({ ...f, profit_margin: e.target.value }))}
                  placeholder="0.2"
                  disabled={loading}
                />
              </td>
              <td className="py-2 px-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  className="border rounded px-2 py-1 w-full mt-2"
                  value={form.vat_rate}
                  onChange={e => setForm(f => ({ ...f, vat_rate: e.target.value }))}
                  placeholder="0.18"
                  disabled={loading}
                />
              </td>
              <td className="py-2 px-2 text-center">
                <input
                  type="checkbox"
                  checked={form.needs_custom_quote}
                  onChange={e => setForm(f => ({ ...f, needs_custom_quote: e.target.checked }))}
                  disabled={loading}
                  className="mt-2"
                />
              </td>
              <td className="py-2 px-2 text-right">
                <button
                  className={`px-4 py-2 text-xs text-white rounded mr-2 shadow ${
                    editingId ? "bg-blue-600" : "bg-green-600"
                  }`}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                  <button
                    className="text-xs px-3 py-2 rounded bg-gray-200 text-gray-700 border"
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
      <div className="text-xs text-gray-400 mt-4">
        <span className="font-semibold">Tip:</span> Supported image formats: JPG, PNG, WebP, etc. Image will be shown in the quote page.
      </div>
    </div>
  );
};

export default ShowerTypeManager;