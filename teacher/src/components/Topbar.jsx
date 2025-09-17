import React from "react";
import { Link } from "react-router-dom";

export default function Topbar({ admin = {}, notifications = [], onLogout, onMenuToggle, isMobile }) {
  // Fallback for admin properties
  const adminName = admin?.fullName || admin?.name || "Admin";
  const adminImage = admin?.profileImage || "https://via.placeholder.com/40";
  const notifCount = Array.isArray(notifications) ? notifications.length : 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 px-3 d-flex justify-content-between">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button className="btn btn-outline-dark me-3" onClick={onMenuToggle}>
          <i className="bi bi-list fs-4"></i>
        </button>
      )}

      {/* Search Bar */}
      <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search..." />
        <button className="btn btn-outline-primary" type="submit">Search</button>
      </form>

      {/* Notifications and Admin Menu */}
      <div className="d-flex align-items-center">
        {/* Notifications */}
        <div className="position-relative me-3">
          <i className="bi bi-bell fs-5 text-secondary"></i>
          {notifCount > 0 && (
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
              {notifCount}
            </span>
          )}
        </div>

        {/* Admin Dropdown */}
        <div className="dropdown">
          <a
            className="dropdown-toggle text-dark d-flex align-items-center"
            data-bs-toggle="dropdown"
            href="#!"
          >
            <img
              src={adminImage}
              alt="admin"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <strong>{adminName}</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
            <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={onLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
