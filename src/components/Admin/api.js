import axios from 'axios';

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // Set your API URL here
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

export default api;