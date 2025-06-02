import axios from 'axios';

// This file sets up the Axios instance for API requests in the Admin section of the app.
// Set your API base URL here
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api",
});

// Add the Authorization header if token is present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Your login code should set localStorage.setItem("token", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// OPTIONAL: Handle token errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      // Token might be invalid/expired. Force logout or show message.
      localStorage.removeItem("token");
      window.location.href = "/login"; // or use your router's redirect
    }
    return Promise.reject(error);
  }
);
export const API_BASE_URL = api.defaults.baseURL?.replace(/\/api$/, "") || ""; // For use in image URLs!
export default api;