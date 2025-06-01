import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

const GasketPricingManager = () => {
  const [gasketPricing, setGasketPricing] = useState([]);
  const [gasketTypes, setGasketTypes] = useState([]);
  const [colors, setColors] = useState([
    "Black",
    "White",
    "Transparent",
    "Grey",
    "Beige",
  ]);
  const [gasketTypeId, setGasketTypeId] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [editing, setEditing] = useState(null);

  // Fetch all data for gaskets and pricing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pricingRes, gasketTypesRes] = await Promise.all([
          axios.get(`${API}/gasket-pricing`),
          axios.get(`${API}/gasket-types`),
        ]);

        setGasketPricing(pricingRes.data);
        setGasketTypes(gasketTypesRes.data);
      } catch (error) {
        console.error("Error fetching gasket data:", error);
      }
    };

    fetchData();
  }, []);

  // Add or update gasket pricing
  const saveGasketPricing = async () => {
    if (!gasketTypeId || !color || price === "") return;

    const payload = {
      gasket_type_id: gasketTypeId,
      color,
      unit_price: parseFloat(price),
    };

    try {
      if (editing) {
        // Update pricing
        await axios.put(
          `${API}/gasket-pricing/${editing.id}`,
          payload
        );
        setGasketPricing((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...payload } : p))
        );
      } else {
        // Add new pricing
        const response = await axios.post(`${API}/gasket-pricing`, payload);
        setGasketPricing((prev) => [...prev, response.data]);
      }

      // Clear form
      setEditing(null);
      setGasketTypeId("");
      setColor("");
      setPrice("");
    } catch (error) {
      console.error("Error saving gasket pricing:", error);
    }
  };

  // Delete gasket pricing
  const deleteGasketPricing = async (id) => {
    if (!window.confirm("Delete this gasket price?")) return;

    try {
      await axios.delete(`${API}/gasket-pricing/${id}`);
      setGasketPricing((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting gasket pricing:", error);
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-2">Gasket Pricing</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-xs text-gray-500">
            <th>Gasket Type</th>
            <th>Color</th>
            <th>Unit Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {gasketPricing.map((p) => (
            <tr key={p.id}>
              <td>{p.gasket_type_name}</td>
              <td>{p.color}</td>
              <td>{p.unit_price}</td>
              <td>
                <button
                  className="text-xs text-blue-600"
                  onClick={() => {
                    setEditing(p);
                    setGasketTypeId(p.gasket_type_id);
                    setColor(p.color);
                    setPrice(p.unit_price);
                  }}
                >
                  Edit
                </button>{" "}
                <button
                  className="text-xs text-red-600"
                  onClick={() => deleteGasketPricing(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <select
                className="border px-1 py-0.5 text-xs w-full"
                value={gasketTypeId}
                onChange={(e) => setGasketTypeId(e.target.value)}
              >
                <option value="">Gasket type</option>
                {gasketTypes.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                className="border px-1 py-0.5 text-xs w-full"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="">Color</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <input
                className="border px-1 py-0.5 text-xs w-full"
                value={price}
                type="number"
                min="0"
                step="0.01"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Unit Price"
              />
            </td>
            <td>
              <button
                className="text-xs text-green-600"
                onClick={saveGasketPricing}
              >
                {editing ? "Update" : "Add"}
              </button>
              {editing && (
                <button
                  className="text-xs text-gray-500 ml-2"
                  onClick={() => {
                    setEditing(null);
                    setGasketTypeId("");
                    setColor("");
                    setPrice("");
                  }}
                >
                    Cancel
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GasketPricingManager;