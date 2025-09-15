import React from "react";
import { Link } from "react-router-dom";

export default function Topbar({ admin, onLogout, onMenuToggle, isMobile }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 px-3 d-flex justify-content-between">
      {isMobile && (
        <button className="btn btn-outline-dark me-3" onClick={onMenuToggle}>
          <i className="bi bi-list fs-4"></i>
        </button>
      )}
      <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search..." />
        <button className="btn btn-outline-primary" type="submit">Search</button>
      </form>
      <div className="d-flex align-items-center">
        <i className="bi bi-bell me-3 fs-5 text-secondary position-relative">
          <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">3</span>
        </i>
        <div className="dropdown">
          <a className="dropdown-toggle text-dark d-flex align-items-center" data-bs-toggle="dropdown" href="#!">
            <img src={admin?.profileImage || "https://via.placeholder.com/40"} alt="admin" className="rounded-circle me-2" width="40" height="40"/>
            <strong>{admin?.fullName || "Admin"}</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
            <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-danger" onClick={onLogout}>Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
