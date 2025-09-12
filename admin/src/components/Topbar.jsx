// src/components/Topbar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Topbar({ admin, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white rounded shadow-sm mb-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Search Form */}
        <form className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search..."
          />
          <button className="btn btn-outline-primary" type="submit">
            Search
          </button>
        </form>

        {/* Notifications and Admin Dropdown */}
        <div className="d-flex align-items-center">
          {/* Notifications Bell */}
          <i className="bi bi-bell me-3 fs-5 text-secondary position-relative">
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
              3
            </span>
          </i>

          {/* Admin Dropdown */}
          <div className="dropdown d-inline">
            <a
              href="#!"
              className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <img
                src={admin.profileImage || "https://via.placeholder.com/40"}
                className="rounded-circle me-2"
                alt={admin.fullName}
                width="40"
                height="40"
              />
              <strong>{admin.fullName}</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow">
              <li>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/settings">
                  Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={onLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
