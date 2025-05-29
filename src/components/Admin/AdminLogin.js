import React, { useState } from "react";
import axios from "axios";

const API = "https://shower-quote-backend.onrender.com/api";

// ⚡️ Set axios credentials globally (do this ONCE, ideally in index.js or App.js as well)
axios.defaults.withCredentials = true;

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/login`, { username, password });
      setError("");
      onLogin && onLogin();
    } catch (err) {
      setError("Login failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <form className="max-w-xs mx-auto bg-white p-4 rounded shadow" onSubmit={login}>
      <h2 className="font-bold mb-2">Admin Login</h2>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        className="w-full bg-blue-600 text-white py-2 rounded"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};

export default AdminLogin;