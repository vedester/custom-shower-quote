import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

const GalleryManager = () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    axios.get(`${API}/gallery`).then(r => setImages(r.data));
  }, [refresh]);

  const save = async () => {
    let imagePath = editing?.image_path;
    if (file) {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post(`${API}/upload-image`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      imagePath = res.data.image_path;
    }
    if (editing) {
      await axios.put(`${API}/gallery/${editing.id}`, { image_path: imagePath, description }, { withCredentials: true });
    } else {
      await axios.post(`${API}/gallery`, { image_path: imagePath, description }, { withCredentials: true });
    }
    setEditing(null);
    setFile(null);
    setDescription("");
    setRefresh(r => r + 1);
  };

  const del = async (id) => {
    if (window.confirm("Delete this image?")) {
      await axios.delete(`${API}/gallery/${id}`, { withCredentials: true });
      setRefresh(r => r + 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        {images.map(img => (
          <div key={img.id} className="flex flex-col items-center">
            <img src={img.image_path} alt={img.description} className="w-full h-32 object-cover rounded mb-1" />
            <div className="text-xs mb-1">{img.description}</div>
            <button className="text-xs text-blue-600" onClick={() => {
              setEditing(img);
              setDescription(img.description);
              setFile(null);
            }}>Edit</button>
            <button className="text-xs text-red-600" onClick={() => del(img.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <input
          type="file"
          className="border p-1 text-xs"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
        />
        <input
          className="border px-1 py-0.5 text-xs"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button className="text-xs text-green-600" onClick={save}>{editing ? "Update" : "Add"}</button>
        {editing && <button className="text-xs text-gray-500 ml-2" onClick={() => {
          setEditing(null); setFile(null); setDescription("");
        }}>Cancel</button>}
      </div>
    </div>
  );
};

export default GalleryManager;