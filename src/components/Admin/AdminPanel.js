import React, { useState } from "react";
import GlassTypeManager from "./GlassTypeManager";
import GlassThicknessManager from "./GlassThicknessManager";
import FinishManager from "./FinishManager";
import HardwareTypeManager from "./HardwareTypeManager";
import SealTypeManager from "./SealTypeManager";
import ShowerTypeManager from "./ShowerTypeManager";
import ModelManager from "./ModelManager";
import AddonManager from "./AddonManager";
import GlassPricingManager from "./GlassPricingManager";
import HardwarePricingManager from "./HardwarePricingManager";
import SealPricingManager from "./SealPricingManager";
import GalleryManager from "./GalleryManager";
import AdminLogin from "./AdminLogin";

// This assumes you have implemented AddonManager, GlassPricingManager, HardwarePricingManager, SealPricingManager, GalleryManager, and AdminLogin.


const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // You could enhance this with a "check session" effect on mount,
  // but for now, login is session-based and persists until logout or reload.

  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      {/* Core Entities */}
      <section>
        <h2 className="text-xl font-bold mb-2">Shower Types</h2>
        <ShowerTypeManager />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">Models</h2>
        <ModelManager />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">Model Add-ons</h2>
        <AddonManager />
      </section>
      
      {/* Supporting Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-2">Glass Types</h2>
          <GlassTypeManager />
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Glass Thicknesses</h2>
          <GlassThicknessManager />
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Finishes</h2>
          <FinishManager />
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Hardware Types</h2>
          <HardwareTypeManager />
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Seal Types</h2>
          <SealTypeManager />
        </section>
      </div>

      {/* Pricing Managers */}
      <section>
        <h2 className="text-xl font-bold mb-2">Glass Pricing</h2>
        <GlassPricingManager />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">Hardware Pricing</h2>
        <HardwarePricingManager />
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">Seal Pricing</h2>
        <SealPricingManager />
      </section>

      {/* Gallery/Image Management */}
      <section>
        <h2 className="text-xl font-bold mb-2">Gallery/Image Management</h2>
        <GalleryManager />
      </section>
    </div>
  );
};

export default AdminPanel;