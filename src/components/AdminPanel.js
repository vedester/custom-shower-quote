import React, { useState, useEffect } from 'react';

const defaultSettings = {
  companyEmail: 'info@yourcompany.com',
  profitMargin: 0.3,
  glassTypes: [
    { name: 'Clear', price: 45 },
    { name: 'Extra Clear', price: 60 }
    // ...add more as needed
  ],
  // Add hardware and addOns as needed
};

const ADMIN_PASSWORD = 'admin123'; // Change this to your own password

export default function AdminPanel({ onClose }) {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem('adminSettings');
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) setAuthenticated(true);
    else alert('Wrong password');
  };

  const handleSave = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  if (!authenticated) {
    return (
      <div className="p-6">
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2>Admin Panel</h2>
      <label>
        Company Email:
        <input
          type="email"
          value={settings.companyEmail}
          onChange={e => setSettings({ ...settings, companyEmail: e.target.value })}
        />
      </label>
      <br />
      <label>
        Profit Margin:
        <input
          type="number"
          step="0.01"
          value={settings.profitMargin}
          onChange={e => setSettings({ ...settings, profitMargin: parseFloat(e.target.value) })}
        />
      </label>
      <br />
      {/* Add more forms for glassTypes, hardware, addOns as needed */}
      <button onClick={handleSave}>Save Settings</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}