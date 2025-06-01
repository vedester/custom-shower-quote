import React, { useEffect } from "react";

const SelectedPricesDebugger = ({
  formData,
  models,
  showerTypes,
  glassTypes,
  glassThicknesses,
  glassPricing,
  hardwarePricing,
  finishes,
  addOns
}) => {
  useEffect(() => {
    // Find selected objects
    const selectedModel = models.find(m => String(m.id) === String(formData.model));
    const selectedShowerType = showerTypes.find(st => String(st.id) === String(formData.showerType));
    const selectedGlassType = glassTypes.find(g => String(g.id) === String(formData.glassType));
    const selectedGlassThickness = glassThicknesses.find(th => String(th.id) === String(formData.glassThickness));
    const selectedFinish = finishes.find(f => String(f.id) === String(formData.hardwareFinish));

    // Find price for glass
    let glassPrice = 0;
    if (selectedGlassType && selectedGlassThickness) {
      const glassPriceRow = glassPricing.find(
        p =>
          String(p.glass_type_id) === String(selectedGlassType.id) &&
          String(p.thickness_id) === String(selectedGlassThickness.id)
      );
      glassPrice = glassPriceRow ? Number(glassPriceRow.price_per_m2) : 0;
    }

    // Find price for hardware
    let hardwarePrice = 0;
    if (selectedModel && selectedFinish) {
      const hardwareTypeId = selectedModel.hardware_type_id || selectedModel.id; // adjust if needed
      const finishId = selectedFinish.id;
      const hardwarePriceRow = hardwarePricing.find(
        p =>
          String(p.hardware_type_id) === String(hardwareTypeId) &&
          String(p.finish_id) === String(finishId)
      );
      hardwarePrice = hardwarePriceRow ? Number(hardwarePriceRow.unit_price) : 0;
    }

    // Add-ons
    let addOnsTotal = 0;
    if (formData.addOnQuantities) {
      Object.entries(formData.addOnQuantities).forEach(([addonName, qty]) => {
        const addon = addOns.find(a => a.name === addonName);
        if (addon && qty > 0) {
          addOnsTotal += Number(addon.price) * qty;
        }
      });
    }

    // Print out all selections and prices
    console.log("User Selections and Prices:");
    console.log("Model:", selectedModel ? selectedModel.name : "None");
    console.log("Shower Type:", selectedShowerType ? selectedShowerType.name : "None");
    console.log("Glass Type:", selectedGlassType ? selectedGlassType.name : "None");
    console.log("Glass Thickness:", selectedGlassThickness ? selectedGlassThickness.thickness_mm + "mm" : "None");
    console.log("Glass Price per m2:", glassPrice);
    console.log("Hardware Finish:", selectedFinish ? selectedFinish.name : "None");
    console.log("Hardware Price:", hardwarePrice);
    console.log("Add-ons Total:", addOnsTotal);

    if (formData.addOnQuantities) {
      Object.entries(formData.addOnQuantities).forEach(([addonName, qty]) => {
        if (qty > 0) {
          const addon = addOns.find(a => a.name === addonName);
          console.log(`Add-on: ${addonName} x${qty} - Price: ${addon ? addon.price : 0}`);
        }
      });
    }
    console.log("--------------------------");
  }, [
    formData,
    models,
    showerTypes,
    glassTypes,
    glassThicknesses,
    glassPricing,
    hardwarePricing,
    finishes,
    addOns
  ]);

  return null; // This component does not render anything
};

export default SelectedPricesDebugger;