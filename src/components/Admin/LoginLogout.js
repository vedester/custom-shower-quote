import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api";

const LoginLogout = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if a token exists in localStorage
  const token = localStorage.getItem("token");

  // Check if the token is valid (decode and check expiration)
  const isTokenValid = () => {
    if (!token) return false;
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(atob(payload));
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime; // Check if the token is expired
    } catch (err) {
      return false;
    }
  };

  // If already logged in, redirect to /admin
  React.useEffect(() => {
    if (token && isTokenValid()) {
      navigate("/admin", { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      setError("");
      // Redirect to /admin after successful login
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid username or password.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out!");
    navigate("/login");
  };

  return (
    <div className="login-page flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default LoginLogout;