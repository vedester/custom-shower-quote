import React from "react";

const ModelCard = ({ imageSrc, modelName }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      borderRadius: "1.5rem",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      minHeight: 400,
      minWidth: 350,
      maxWidth: 500,
      margin: "auto",
      flexDirection: "column",
      padding: "2rem"
    }}
  >
    {imageSrc ? (
      <img
        src={imageSrc}
        alt={modelName}
        style={{
          maxHeight: 340,
          maxWidth: "100%",
          objectFit: "contain",
          borderRadius: "1rem",
          border: "2px solid #3182ce",
          boxShadow: "0 6px 20px rgba(49,130,206,0.09)",
        }}
      />
    ) : (
      <div style={{ color: "#aaa", fontSize: "1.2rem", textAlign: "center" }}>
        No Image Available
      </div>
    )}
    <div style={{ marginTop: "0.5rem", fontWeight: "600", fontSize: "1.3rem" }}>
      {modelName || "Model Name"}
    </div>
  </div>
);

export default ModelCard;