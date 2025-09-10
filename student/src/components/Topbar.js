import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // default: not logged in

  const handleLogin = () => {
    setIsLoggedIn(true);
    alert("✅ You are now logged in!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("👋 You have been logged out!");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold text-primary">
          🎓 Smart Education
        </Link>

        {/* Search Bar */}
        <form className="d-none d-md-flex mx-3" style={{ flex: 1, maxWidth: "400px" }}>
          <input
            className="form-control form-control-sm"
            type="search"
            placeholder="Search courses, assignments..."
            aria-label="Search"
          />
        </form>

        {/* Right Side */}
        <div className="d-flex align-items-center">
          {/* Notifications */}
          {isLoggedIn && (
            <>
              <i
                className="bi bi-chat-dots me-3 fs-5 text-secondary position-relative"
                role="button"
              >
                <span className="badge bg-success rounded-pill position-absolute top-0 start-100 translate-middle">
                  3
                </span>
              </i>
              <i
                className="bi bi-bell me-3 fs-5 text-secondary position-relative"
                role="button"
              >
                <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                  4
                </span>
              </i>
            </>
          )}

          {/* If logged in → show profile + logout */}
          {isLoggedIn ? (
            <div className="dropdown">
              <img
                src="https://via.placeholder.com/40"
                alt="profile"
                className="rounded-circle dropdown-toggle"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                role="button"
                style={{ cursor: "pointer" }}
              />
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i> Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/settings">
                    <i className="bi bi-gear me-2"></i> Settings
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            // If not logged in → show Login / Register
            <div>
              <button className="btn btn-sm btn-primary me-2" onClick={handleLogin}>
                Login
              </button>
              <Link to="/register" className="btn btn-sm btn-outline-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
