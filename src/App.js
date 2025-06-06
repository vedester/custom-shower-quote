import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import QuoteCalculator from "./components/QuoteCalculator";
import ShowerConfigurator from "./components/ShowerConfigurator";
import AddOnsSection from "./components/AddOnsSection";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import AdminPanel from "./components/Admin/AdminPanel";
import CustomerInfoCard from "./components/CustomerInfoCard";
import LoginLogout from "./components/Admin/LoginLogout";
import "./App.css";
import "./i18n/i18n";
import { useTranslation } from "react-i18next";
// Use the centralized API connector
import api,{ API_BASE_URL }  from "./components/Admin/api";
import ModelCard from "./components/ModelCard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { t, i18n } = useTranslation();

  // Backend options state
  const [showerTypes, setShowerTypes] = useState([]);
  const [models, setModels] = useState([]);
  const [glassTypes, setGlassTypes] = useState([]);
  const [glassThicknesses, setGlassThicknesses] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    api.get("/shower-types").then((res) => setShowerTypes(res.data));
    api.get("/models").then((res) => setModels(res.data));
    api.get("/glass-types").then((res) => setGlassTypes(res.data));
    api.get("/glass-thickness").then((res) => setGlassThicknesses(res.data));
    api.get("/finishes").then((res) => setFinishes(res.data));
    api.get("/addons").then((res) => setAddons(res.data));
  }, []);

  // Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    city: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    showerType: "",
    model: "",
    glassType: "",
    glassThickness: "",
    hardwareFinish: "",
    height: "",
    width: "",
    length: "",
    addOnQuantities: {},
    customAddon: "",
    photo: null,
  });

  // Handlers
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Language toggle
  const toggleLanguage = (lang) => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  };

  // Main Grid Component
  function MainGrid() {
    const selectedModel = models.find((m) => String(m.id) === String(formData.model));

    return (
      <div className="w-full max-w-5xl mx-auto mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* RIGHT COLUMN (Configurator & Add-ons) */}
        <div className="order-1 sm:order-2 flex flex-col gap-2">
          <div className="bg-white rounded-xl shadow p-2">
            <h2 className="text-xs font-bold text-blue-700 mb-1">
              {t("Glass Configuration & Add-Ons")}
            </h2>
            <ShowerConfigurator
              formData={formData}
              onFormChange={handleFormChange}
              showerTypes={showerTypes}
              models={models}
              glassTypes={glassTypes}
              glassThicknesses={glassThicknesses}
              finishes={finishes}
            />
            <div className="border-t my-2" />
            <AddOnsSection
              addOnQuantities={formData.addOnQuantities}
              onFormChange={handleFormChange}
              addons={addons}
            />
          </div>
        </div>
        {/* LEFT COLUMN (Model Preview & Quote Summary) */}
        <div className="order-2 sm:order-1 flex flex-col gap-7">
          <div className="bg-white rounded-xl shadow p- h-[200px] flex items-center justify-center">
            <ModelCard
              imageSrc={
                selectedModel && selectedModel.image_path
                  ? `${API_BASE_URL}${selectedModel.image_path}`
                  : "/no-image-placeholder.png"
              }
              modelName={selectedModel ? selectedModel.name : ""}
            />
          </div>
          <div className="bg-white rounded-xl shadow p-1">
            <QuoteCalculator
              customerInfo={customerInfo}
              formData={formData}
              glassTypes={glassTypes}
              glassThicknesses={glassThicknesses}
              finishes={finishes}
              addOns={addons}
              models={models}
              showerTypes={showerTypes}
              companySettings={{}}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-emerald-100 py-2 px-1 text-[90%]">
        {/* NAVBAR & TITLE */}
        <header className="w-full max-w-5xl mx-auto mb-2">
          <div className="bg-white shadow rounded-xl flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-2 gap-2">
            {/* Logo & Title */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  className="w-8 h-8 object-cover rounded-full border border-blue-500 shadow"
                />
              </Link>
              <h1 className="text-lg font-bold text-blue-700 tracking-tight drop-shadow-sm">
                {t("title")}
              </h1>
            </div>

            {/* Nav + Language Toggle */}
            <nav className="flex flex-wrap items-center gap-1">
              {[
                { to: "/", label: t("Home") },
                { to: "/about", label: t("About Us") },
                { to: "/gallery", label: t("Gallery") },
                { to: "/faq", label: t("FAQ") },
                { to: "/contact", label: t("Contact Us") },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-xs font-medium text-gray-700 px-1.5 py-1 rounded hover:text-blue-700 hover:bg-blue-100 transition active:scale-95"
                >
                  {label}
                </Link>
              ))}
              {/* Admin Panel Button */}
              <Link
                to="/admin"
                className="text-xs font-bold text-white bg-blue-700 px-1.5 py-1 rounded hover:bg-blue-900 transition ml-1"
              >
                Admin
              </Link>

              {/* Language Switcher */}
              <div className="flex gap-0.5">
                <button
                  onClick={() => toggleLanguage("en")}
                  className={`text-[10px] px-2 py-1 rounded transition font-semibold ${
                    i18n.language === "en"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                  aria-label="Switch to English"
                >
                  English
                </button>
                <button
                  onClick={() => toggleLanguage("he")}
                  className={`text-[10px] px-2 py-1 rounded transition font-semibold ${
                    i18n.language === "he"
                      ? "bg-blue-600 text-white shadow"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                  aria-label="Switch to Hebrew"
                >
                  עברית
                </button>
              </div>
            </nav>
          </div>
        </header>

        {/* Customer Info Card DIRECTLY after header */}
        <div className="w-full max-w-5xl mx-auto mb-0.5">
          <CustomerInfoCard
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            t={t}
          />
        </div>

        {/* MAIN CONTENT */}
        <main>
          <Routes>
            <Route path="/" element={<MainGrid />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<LoginLogout />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;