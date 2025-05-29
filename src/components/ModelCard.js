import React from "react";

/**
 * ModelCard displays a model image and name.
 * The image fits the card area, always contained and centered.
 */
const ModelCard = ({ imageSrc, modelName }) => (
  <div
    className="
      flex flex-col items-center justify-center
      w-full h-full
      bg-white rounded-2xl shadow-lg
      overflow-hidden
    "
    style={{
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
    }}
  >
    <div className="flex-1 w-full flex items-center justify-center">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={modelName}
          className="object-contain w-full h-full"
          style={{
            background: "#f8fafc"
          }}
        />
      ) : (
        <div className="text-gray-400 text-lg text-center w-full">
          No Image Available
        </div>
      )}
    </div>
    <div className="py-2 font-semibold text-blue-700 text-base sm:text-lg text-center w-full bg-white">
      {modelName || "Model Name"}
    </div>
  </div>
);

export default ModelCard;