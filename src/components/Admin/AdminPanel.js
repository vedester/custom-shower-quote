import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

import ShowerTypeManager from "./ShowerTypeManager";
import ModelManager from "./ModelManager";
import ModelComponentEditor from "./ModelComponentEditor";

// Glass management components
import GlassTypeManager from "./GlassTypeManager";
import GlassPricingManager from "./GlassPricingManager";
import GlassThicknessManager from "./GlassThicknessManager";

// Hardware and seal pricing management components
import FinishManager from "./FinishManager";
import HardwareTypeManager from "./HardwareTypeManager";
import HardwarePricingManager from "./HardwarePricingManager";
import SealPricingManager from "./SealPricingManager";
import SealTypeManager from "./SealTypeManager";

// Add-ons management component
import AddonManager from "./AddonManager";

// Glass price tester for admin (testing only)
import FindGlassPrice from "./FindGlassPrice";

// Hardware price tester for admin (testing only)
import FindHardwarePrice from "./FindHardwarePrice";

// Add-on price tester for admin (testing only)
import FindAddonPrice from "./FindAddonPrice";

// Placeholder components
const Dashboard = () => <div><h2>Dashboard</h2><p>Welcome to the Admin Panel!</p></div>;
const GalleryManagement = () => <div><h2>Gallery Management</h2></div>;
const AdminManagement = () => <div><h2>Admin Management</h2></div>;

const AdminPanel = () => {
  const [userRole, setUserRole] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [glassPricing, setGlassPricing] = useState([]);
  const [hardwarePricing, setHardwarePricing] = useState([]);
  const [addonPricing, setAddonPricing] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null); // For ModelComponentEditor modal
  const [refreshModels, setRefreshModels] = useState(0);
  const navigate = useNavigate();

  const navItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "showerTypes", label: "Shower Types" },
    { key: "models", label: "Models" },
    // Glass management
    { key: "glassTypes", label: "Glass Types" },
    { key: "glassPricing", label: "Glass Pricing" },
    { key: "glassThickness", label: "Glass Thickness" },
    // Hardware management
    { key: "finishes", label: "Hardware Finishes" },
    { key: "hardwareTypes", label: "Hardware Types" },
    { key: "hardwarePricing", label: "Hardware Pricing" },
    // Seal management
    { key: "sealTypes", label: "Seal Types" },
    { key: "sealPricing", label: "Seal Pricing" },
    // Others
    { key: "addons", label: "Add-ons" },
    { key: "gallery", label: "Gallery" },
    { key: "admins", label: "Admins" },
    // TESTING ONLY
    { key: "testGlassPrice", label: "Test Glass Price" },
    { key: "testHardwarePrice", label: "Test Hardware Price" },
    { key: "testAddonPrice", label: "Test Add-On Price" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.role !== "admin") {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        setUserRole(payload.role);
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } finally {
      setCheckingAuth(false);
    }
  }, [navigate]);

  // Fetch glass pricing for test section only
  useEffect(() => {
    if (activeSection === "testGlassPrice") {
      api.get("/glass-pricing")
        .then(res => setGlassPricing(res.data))
        .catch(() => setGlassPricing([]));
    }
  }, [activeSection]);

  // Fetch hardware pricing for test section only
  useEffect(() => {
    if (activeSection === "testHardwarePrice") {
      api.get("/hardware-pricing")
        .then(res => setHardwarePricing(res.data))
        .catch(() => setHardwarePricing([]));
    }
  }, [activeSection]);

  // Fetch add-on pricing for test section only
  useEffect(() => {
    if (activeSection === "testAddonPrice") {
      api.get("/addon-pricing")
        .then(res => setAddonPricing(res.data))
        .catch(() => setAddonPricing([]));
    }
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // Render ModelManager with ability to open ModelComponentEditor modal
  const renderModelsWithEditor = () => (
    <div>
      <ModelManager
        onEditComponents={model => setSelectedModel(model)}
        refreshModelsFlag={refreshModels}
        onModelChange={() => setRefreshModels((c) => c + 1)}
      />
      {selectedModel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setSelectedModel(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => setSelectedModel(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center gap-2">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="inline" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              Edit Model Components: <span className="ml-2">{selectedModel.name}</span>
            </h3>
            <ModelComponentEditor
              model={selectedModel}
              refreshModels={() => setRefreshModels((c) => c + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "showerTypes":
        return <ShowerTypeManager />;
      case "models":
        return renderModelsWithEditor();
      case "glassTypes":
        return <GlassTypeManager />;
      case "glassPricing":
        return <GlassPricingManager />;
      case "glassThickness":
        return <GlassThicknessManager />;
      case "finishes":
        return <FinishManager />;
      case "hardwareTypes":
        return <HardwareTypeManager />;
      case "hardwarePricing":
        return <HardwarePricingManager />;
      case "sealTypes":
        return <SealTypeManager />;
      case "sealPricing":
        return <SealPricingManager />;
      case "addons":
        return <AddonManager />;
      case "gallery":
        return <GalleryManagement />;
      case "admins":
        return <AdminManagement />;
      case "testGlassPrice":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Test Glass Price</h2>
            <p className="mb-2">Test glass pricing by selecting type and thickness below.</p>
            <FindGlassPrice glassPricing={glassPricing} />
          </div>
        );
      case "testHardwarePrice":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Test Hardware Price</h2>
            <p className="mb-2">Test hardware pricing by selecting type and finish below.</p>
            <FindHardwarePrice hardwarePricing={hardwarePricing} />
          </div>
        );
      case "testAddonPrice":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Test Add-On Price</h2>
            <p className="mb-2">Test add-on pricing by selecting an add-on and quantity below.</p>
            <FindAddonPrice addonPricing={addonPricing} />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (checkingAuth || userRole !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                activeSection === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-6 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">{renderSection()}</main>
    </div>
  );
};

export default AdminPanel;