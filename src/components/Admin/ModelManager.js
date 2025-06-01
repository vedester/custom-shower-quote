import React, { useEffect, useState } from "react";
import api from "./api";
// import { useTranslation } from "react-i18next"; // Uncomment if i18n is integrated

const IMAGE_BASE_URL = "https://shower-quote-backend.onrender.com"; // Update if needed

const ModelManager = () => {
  // const { t } = useTranslation(); // Uncomment when using i18n
  const [models, setModels] = useState([]);
  const [showerTypes, setShowerTypes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", showerTypeId: "", image: null, description: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [modelRes, typeRes] = await Promise.all([
        api.get("/models"),
        api.get("/shower-types"),
      ]);
      setModels(modelRes.data);
      setShowerTypes(typeRes.data);
    } catch (err) {
      console.error(err);
      setFeedback("Failed to load models or shower types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        setFeedback("Image must be under 2MB.");
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const { name, showerTypeId, image, description } = form;
    if (!name.trim() || !showerTypeId) {
      setFeedback("Model name and shower type are required.");
      return;
    }

    if (!editing && !image) {
      setFeedback("Image is required for new models.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", name.trim());
    data.append("showerTypeId", showerTypeId);
    data.append("description", description || "");
    if (image) data.append("image", image);

    try {
      let res;
      if (editing) {
        res = await api.put(`/models/${editing.id}`, data);
        setModels((prev) =>
          prev.map((m) => (m.id === editing.id ? res.data : m))
        );
        setFeedback("Model updated.");
      } else {
        res = await api.post("/models", data);
        setModels((prev) => [...prev, res.data]);
        setFeedback("Model added.");
      }

      setPreview(res.data.image_path ? IMAGE_BASE_URL + res.data.image_path : null);
      resetForm();
    } catch (err) {
      console.error(err);
      setFeedback("Failed to save model.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this model?")) return;
    setLoading(true);
    try {
      await api.delete(`/models/${id}`);
      setModels((prev) => prev.filter((m) => m.id !== id));
      setFeedback("Model deleted.");
      if (editing?.id === id) resetForm();
    } catch (err) {
      console.error(err);
      setFeedback("Failed to delete model.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", showerTypeId: "", image: null, description: "" });
    setPreview(null);
    setFeedback("");
  };

  const isError = feedback.toLowerCase().includes("fail");

  const getModelImage = (m) => m.image_path ? IMAGE_BASE_URL + m.image_path : null;

  return (
    <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto relative">
      <h2 className="font-bold text-lg mb-4">Model Management</h2>

      {feedback && (
        <div
          className={`mb-4 text-sm px-4 py-2 rounded ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {feedback}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
          <span className="text-sm text-gray-500">Processing...</span>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-2">
        Showing {models.length} model{models.length !== 1 ? "s" : ""}
      </p>

      <table className={`w-full mb-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
        <thead>
          <tr className="text-xs text-gray-500 border-b">
            <th className="text-left py-2">Model</th>
            <th className="text-left py-2">Shower Type</th>
            <th className="text-left py-2">Image</th>
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{m.name}</td>
              <td className="py-2">
                {m.shower_type_name || showerTypes.find((t) => t.id === m.shower_type_id)?.name || "—"}
              </td>
              <td className="py-2">
                {getModelImage(m) ? (
                  <img
                    src={getModelImage(m)}
                    alt="Model"
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.png"; // Optional default
                    }}
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </td>
              <td className="py-2 text-sm text-gray-700">{m.description || "—"}</td>
              <td className="py-2 text-right">
                <button
                  className="text-xs text-blue-600 mr-2 hover:underline"
                  onClick={() => {
                    setEditing(m);
                    setForm({
                      name: m.name,
                      showerTypeId: m.shower_type_id || m.showerTypeId,
                      image: null,
                      description: m.description || "",
                    });
                    setPreview(getModelImage(m));
                    setFeedback("");
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-xs text-red-600 hover:underline"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Model name"
          value={form.name}
          onChange={handleInputChange}
          disabled={loading}
        />

        <select
          name="showerTypeId"
          className="border rounded px-3 py-1 text-sm"
          value={form.showerTypeId}
          onChange={handleInputChange}
          disabled={loading}
        >
          <option value="">Select shower type</option>
          {showerTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="description"
          className="border rounded px-3 py-1 text-sm"
          placeholder="Model description"
          value={form.description}
          onChange={handleInputChange}
          disabled={loading}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleInputChange}
          disabled={loading}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png";
            }}
          />
        )}

        <div className="flex gap-2">
          <button
            className={`text-sm px-4 py-2 rounded text-white ${
              editing ? "bg-blue-600" : "bg-green-600"
            }`}
            onClick={handleSave}
            disabled={loading}
          >
            {editing ? "Update Model" : "Add Model"}
          </button>
          {editing && (
            <button
              className="text-sm px-4 py-2 rounded bg-gray-200 text-gray-700"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelManager;
