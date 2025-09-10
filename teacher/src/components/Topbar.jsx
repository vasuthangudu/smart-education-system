import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Topbar({ teacher, onLogout }) {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white shadow-sm mb-4 px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Brand / Welcome */}
        <span className="navbar-brand mb-0 h5">
          👋 Welcome, <strong>{teacher.name}</strong>
        </span>

        {/* Actions Section */}
        <div className="d-flex align-items-center gap-3">
          {/* Search Bar */}
          <form className="d-none d-md-flex">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search..."
                className="form-control form-control-sm"
              />
              <button className="btn btn-outline-secondary btn-sm" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Notifications Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-notifications"
              className="position-relative border-0"
            >
              <i className="bi bi-bell fs-5 text-secondary"></i>
              <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                2
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>Notifications</Dropdown.Header>
              <Dropdown.Item>New assignment submissions</Dropdown.Item>
              <Dropdown.Item>Meeting scheduled at 2 PM</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>View all notifications</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Menu */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="dropdown-user"
              className="d-flex align-items-center border-0"
            >
              <img
                src={teacher.avatar || "https://via.placeholder.com/40"}
                alt="profile"
                className="rounded-circle me-2"
                width="40"
                height="40"
              />
              <span className="d-none d-lg-inline">{teacher.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>{teacher.email}</Dropdown.Header>
              <Dropdown.Item as={Link} to="/profile">
                <i className="bi bi-person me-2"></i> Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings">
                <i className="bi bi-gear me-2"></i> Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
}
