import React, { useState } from "react";
import * as XLSX from "xlsx"; // Import the xlsx library
import apiClient from "./api"; // Use pre-configured Axios instance

const ExcelImportManager = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadStatus("");
  };

  // Parse Excel file and extract data
  const parseExcelFile = async () => {
    if (!file) {
      setUploadStatus("Please select an Excel file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      try {
        // Parse each sheet and upload
        await processSheet(workbook, "Hardware Pricing", "hardware-pricing");
        await processSheet(workbook, "Gasket Pricing", "gasket-pricing");
        await processSheet(workbook, "Glass Pricing", "glass-pricing");

        setUploadStatus("All data uploaded successfully!");
      } catch (error) {
        console.error("Error uploading data:", error);
        setUploadStatus("Failed to upload data. Check the console for details.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Process individual sheets
  const processSheet = async (workbook, sheetName, endpoint) => {
    if (!workbook.Sheets[sheetName]) {
      console.warn(`Sheet "${sheetName}" not found.`);
      setUploadStatus((prev) =>
        `${prev}\nSkipped "${sheetName}" (sheet not found).`
      );
      return;
    }

    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (sheetData.length === 0) {
      console.warn(`Sheet "${sheetName}" is empty.`);
      setUploadStatus((prev) =>
        `${prev}\nSkipped "${sheetName}" (no data in sheet).`
      );
      return;
    }

    try {
      await uploadToAPI(endpoint, sheetData);
      setUploadStatus((prev) => `${prev}\nUploaded "${sheetName}" successfully.`);
    } catch (error) {
      console.error(`Error uploading "${sheetName}":`, error);
      setUploadStatus((prev) =>
        `${prev}\nFailed to upload "${sheetName}". Check the console for details.`
      );
    }
  };

  // Upload data to the API in batches
  const uploadToAPI = async (endpoint, data) => {
    const batchSize = 10; // Adjust batch size as needed
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await apiClient.post(`/${endpoint}`, batch);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Excel File Import</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        onClick={parseExcelFile}
        className="text-xs text-green-600 px-2 py-1 border rounded"
      >
        Upload and Process File
      </button>
      {uploadStatus && (
        <pre className="mt-2 text-sm whitespace-pre-wrap">{uploadStatus}</pre>
      )}
    </div>
  );
};

export default ExcelImportManager;