import React, { useState } from "react";
import "../assets/settings.css";

const Settings = () => {
  const [settings, setSettings] = useState({
    detectionEnabled: true,
    sensitivity: "Medium",
    honeypotActive: false,
    emailAlerts: true,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    alert("Settings Saved Successfully!");
  };

  return (
    <div className="settings-container">
      <h2>Security Settings</h2>
      
      <div className="settings-section">
        <label>
          <input
            type="checkbox"
            name="detectionEnabled"
            checked={settings.detectionEnabled}
            onChange={handleChange}
          />
          Enable Threat Detection
        </label>
      </div>

      <div className="settings-section">
        <label>Sensitivity Level:</label>
        <select name="sensitivity" value={settings.sensitivity} onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="settings-section">
        <label>
          <input
            type="checkbox"
            name="honeypotActive"
            checked={settings.honeypotActive}
            onChange={handleChange}
          />
          Activate Honeypot System
        </label>
      </div>

      <div className="settings-section">
        <label>
          <input
            type="checkbox"
            name="emailAlerts"
            checked={settings.emailAlerts}
            onChange={handleChange}
          />
          Enable Email Alerts for Attacks
        </label>
      </div>

      <button className="save-btn" onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default Settings;
