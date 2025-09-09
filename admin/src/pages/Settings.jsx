// src/AdminSettings.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Adjust path based on actual file location
import "../themes.css"; // ✅ make sure themes.css exists inside src/

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");

  // Apply theme globally
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="card p-4 shadow-lg">
      <h3 className="mb-3 text-primary">⚙️ Admin Settings</h3>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "theme" ? "active" : ""}`}
            onClick={() => setActiveTab("theme")}
          >
            Theme
          </button>
        </li>
      </ul>

      {/* Content Area */}
      <div>
        {activeTab === "profile" && (
          <div>
            <h5>👤 Profile Settings</h5>
            <form className="mt-3">
              <div className="mb-3">
                <label className="form-label">Admin Name</label>
                <input type="text" className="form-control" placeholder="Enter name" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" placeholder="Enter email" />
              </div>
              <button type="button" className="btn btn-primary">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h5>🔒 Security Settings</h5>
            <form className="mt-3">
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" placeholder="Enter current password" />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" placeholder="Enter new password" />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" placeholder="Re-enter new password" />
              </div>
              <button type="button" className="btn btn-warning">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h5>🔔 Notification Settings</h5>
            <form className="mt-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="emailNotif" defaultChecked />
                <label className="form-check-label" htmlFor="emailNotif">
                  Email Notifications
                </label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="smsNotif" />
                <label className="form-check-label" htmlFor="smsNotif">
                  SMS Alerts
                </label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="appNotif" defaultChecked />
                <label className="form-check-label" htmlFor="appNotif">
                  In-App Notifications
                </label>
              </div>
              <button type="button" className="btn btn-success mt-3">
                Save Preferences
              </button>
            </form>
          </div>
        )}

        {activeTab === "theme" && (
          <div>
            <h5>🎨 Theme Settings</h5>
            <div className="d-flex gap-3 mt-3">
              <button type="button" className="btn btn-light border" onClick={() => setTheme("light")}>
                Light Mode
              </button>
              <button type="button" className="btn btn-dark text-white" onClick={() => setTheme("dark")}>
                Dark Mode
              </button>
              <button type="button" className="btn btn-info text-white" onClick={() => setTheme("blue")}>
                Blue Theme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
