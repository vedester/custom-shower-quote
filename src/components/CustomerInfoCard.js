import React from "react";
const limits = { name: 40, city: 40, phone: 16 };

export default function CustomerInfoCard({ customerInfo, setCustomerInfo, t }) {
  const handleChange = (field, value) => {
    if (field === "phone") value = value.replace(/[^0-9+]/g, "");
    if (value.length <= limits[field]) {
      setCustomerInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="bg-white rounded-md shadow p-0.1 mb-0.1 text-xs w-full max-w-md mx-auto">
      <h2 className="text-blue-700 font-semibold text-xs mb-1">
        {t("Customer Info")}
      </h2>
      <div className="grid grid-cols-3 gap-1">
        <input
          value={customerInfo.name}
          onChange={e => handleChange("name", e.target.value)}
          placeholder={t('Enter your name')}
          autoComplete="name"
          name="name"
          maxLength={limits.name}
          className="w-full py-1 px-2 border border-gray-300 rounded bg-blue-50 text-xs"
        />
        <input
          value={customerInfo.city}
          onChange={e => handleChange("city", e.target.value)}
          placeholder={t('Enter your city')}
          autoComplete="address-level2"
          name="city"
          maxLength={limits.city}
          className="w-full py-1 px-2 border border-gray-300 rounded bg-blue-50 text-xs"
        />
        <input
          value={customerInfo.phone}
          onChange={e => handleChange("phone", e.target.value)}
          placeholder={t('Enter phone number')}
          autoComplete="tel"
          name="phone"
          maxLength={limits.phone}
          className="w-full py-1 px-2 border border-gray-300 rounded bg-blue-50 text-xs"
        />
      </div>
      <div className="text-gray-400 text-[10px] mt-1">
        {Object.keys(limits).map(field =>
          <span key={field} className="mr-2">
            {field}: {customerInfo[field].length}/{limits[field]}
          </span>
        )}
      </div>
    </div>
  );
}