import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5007/api/messages";

export default function Topbar({ admin, onLogout, onMenuToggle, isMobile }) {
  const [notifCount, setNotifCount] = useState(0);

  // Fetch notification count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(API);
        // Example: count all unread messages. If your API doesn’t mark read/unread,
        // just use total messages length.
        const count = res.data.filter((msg) => !msg.read).length || res.data.length;
        setNotifCount(count);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 px-3 d-flex justify-content-between">
      {/* Mobile menu toggle */}
      {isMobile && (
        <button className="btn btn-outline-dark me-3" onClick={onMenuToggle}>
          <i className="bi bi-list fs-4"></i>
        </button>
      )}

      {/* Search */}
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

      {/* Right side: Notifications & Profile */}
      <div className="d-flex align-items-center">
        {/* Notification Bell */}
        <Link to="/admin/notifications" className="position-relative me-3 text-secondary">
          <i className="bi bi-bell fs-5"></i>
          {notifCount > 0 && (
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
              {notifCount}
            </span>
          )}
        </Link>

        {/* Admin Profile Dropdown */}
        <div className="dropdown">
          <a
            className="dropdown-toggle text-dark d-flex align-items-center"
            data-bs-toggle="dropdown"
            href="#!"
          >
            <img
              src={admin?.profileImage || "https://via.placeholder.com/40"}
              alt="admin"
              className="rounded-circle me-2"
              width="40"
              height="40"
            />
            <strong>{admin?.fullName || "Admin"}</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
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
            <li>
              <hr className="dropdown-divider" />
            </li>
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
