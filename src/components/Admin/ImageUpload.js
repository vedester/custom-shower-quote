import React, { useRef } from "react";

/**
 * ImageUpload component for uploading and previewing an image.
 * Props:
 *   - currentImage: current image path (string)
 *   - onUpload: function(file) => void
 *   - uploading: boolean (optional)
 */
const ImageUpload = ({ currentImage, onUpload, uploading }) => {
  const fileInput = useRef();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
          {currentImage ? (
            <img
              src={
                currentImage.startsWith("http") || currentImage.startsWith("/")
                  ? `http://localhost:5000${currentImage}`
                  : currentImage
              }
              alt="Preview"
              className="object-contain w-full h-full"
            />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}
        </div>
        <button
          className="px-2 py-1 bg-blue-600 text-white rounded"
          onClick={() => fileInput.current.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUpload;