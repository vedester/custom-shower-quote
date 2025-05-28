import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api"; // Change for production

const Gallery = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios.get(`${API}/gallery`).then(res => setImages(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Gallery</h2>
      <div className="flex justify-center gap-8 flex-wrap">
        {images.length === 0 && (
          <div className="text-gray-400 text-lg">No images in gallery yet.</div>
        )}
        {images.map(img => (
          <div key={img.id} className="mb-4 flex flex-col items-center">
            <img
              src={`http://localhost:5000${img.image_path}`}
              alt={img.description || "Gallery Photo"}
              className="w-60 h-60 object-cover rounded shadow"
            />
            {img.description && (
              <div className="mt-2 text-xs text-gray-600">{img.description}</div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 text-gray-600">Explore our range of custom installations. More photos coming soon!</p>
    </div>
  );
};

export default Gallery;