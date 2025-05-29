import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageUpload from "./ImageUpload";
import ModelComponentEditor from "./ModelComponentEditor";

const API = "https://shower-quote-backend.onrender.com/api";

const ModelManager = () => {
  const [models, setModels] = useState([]);
  const [editingModel, setEditingModel] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showerTypes, setShowerTypes] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/models`).then(res => setModels(res.data));
    axios.get(`${API}/shower-types`).then(res => setShowerTypes(res.data));
  }, [refresh]);

  const handleEdit = (model) => {
    setEditingModel(model);
    setShowEditor(true);
  };

  const handleDelete = async (modelId) => {
    if (window.confirm("Delete this model and all its components?")) {
      await axios.delete(`${API}/models/${modelId}`);
      setRefresh(r => r + 1);
    }
  };

  const handleSave = async (model) => {
    if (model.id) {
      await axios.put(`${API}/models/${model.id}`, model);
    } else {
      await axios.post(`${API}/models`, model);
    }
    setShowEditor(false);
    setRefresh(r => r + 1);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Models</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => { setEditingModel({}); setShowEditor(true); }}
      >
        Add Model
      </button>
      <div className="space-y-4">
        {models.map(model => (
          <div key={model.id} className="border p-4 rounded-lg flex">
            <div className="w-48 h-40 flex-shrink-0 bg-gray-100 mr-4 flex items-center justify-center">
              {model.image_path ? (
                <img
                  src={`https://shower-quote-backend.onrender.com${model.image_path}`}
                  alt={model.name}
                  className="object-contain h-full w-full"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div className="flex-1">
              <div className="font-bold">{model.name}</div>
              <div className="text-sm text-gray-600">{model.description}</div>
              <div className="text-xs text-gray-400 mt-1">
                Shower Type: {model.shower_type_name || "-"}
              </div>
              <div className="flex mt-2 space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => handleEdit(model)}>
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(model.id)}>
                  Delete
                </button>
              </div>
              {/* Component editor for glass, hardware, seals */}
              <ModelComponentEditor model={model} refreshModels={() => setRefresh(r => r + 1)} />
            </div>
          </div>
        ))}
      </div>
      {showEditor && (
        <ModelEditDialog
          model={editingModel}
          showerTypes={showerTypes}
          onSave={handleSave}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

const ModelEditDialog = ({ model, showerTypes, onSave, onClose }) => {
  const [form, setForm] = useState({ ...model });
  const [uploading, setUploading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async file => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    const res = await axios.post("https://shower-quote-backend.onrender.com/api/upload-image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setForm({ ...form, image_path: res.data.image_path });
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-lg shadow-xl">
        <h2 className="font-bold mb-4">{form.id ? "Edit Model" : "Add Model"}</h2>
        <input
          className="w-full border p-2 mb-2"
          name="name"
          placeholder="Model Name"
          value={form.name || ""}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 mb-2"
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
        />
        <select
          className="w-full border p-2 mb-2"
          name="shower_type_id"
          value={form.shower_type_id || ""}
          onChange={handleChange}
        >
          <option value="">Select Shower Type</option>
          {showerTypes.map(st => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>
        <ImageUpload
          currentImage={form.image_path}
          onUpload={handleImageUpload}
          uploading={uploading}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onSave(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelManager;