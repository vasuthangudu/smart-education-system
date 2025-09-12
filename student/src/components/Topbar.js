// src/components/Topbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Dropdown, Image } from "react-bootstrap";
import { useAuth } from "../context/AuthContext"; // import your auth context

export default function Topbar() {
  const { student, logout } = useAuth(); // get logged-in student/admin

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white rounded shadow-sm mb-4 px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold text-primary">
          🎓 Smart Education
        </Link>

        {/* Search */}
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

          {/* Chat Icon */}
          <i className="bi bi-chat-dots me-3 fs-5 text-secondary position-relative">
            <span className="badge bg-success rounded-pill position-absolute top-0 start-100 translate-middle">3</span>
          </i>

          {/* Notifications Icon */}
          <i className="bi bi-bell me-3 fs-5 text-secondary position-relative">
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">4</span>
          </i>

          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              as="a"
              className="d-flex align-items-center text-dark text-decoration-none"
              id="dropdown-custom"
            >
              <Image
                src={student?.profileImage || "https://via.placeholder.com/40"}
                roundedCircle
                width={40}
                height={40}
                className="me-2"
              />
              <div className="d-flex flex-column">
                <strong>{student?.name || "Admin"}</strong>
                <small className="text-muted">{student?.email || "admin@example.com"}</small>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/profile">
                <i className="bi bi-person me-2"></i> Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings">
                <i className="bi bi-gear me-2"></i> Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => logout()}
                className="text-danger"
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
