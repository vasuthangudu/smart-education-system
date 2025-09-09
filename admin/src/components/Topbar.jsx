import React from "react";

function Topbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white rounded shadow-sm mb-4">
      <div className="container-fluid">
        <form className="d-flex">
          <input className="form-control me-2" type="search" placeholder="Search..." />
          <button className="btn btn-outline-primary" type="submit">Search</button>
        </form>
        <div>
          <i className="bi bi-bell me-3 fs-5 text-secondary position-relative">
            <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">3</span>
          </i>
          <div className="dropdown d-inline">
            <a href="/" className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
              <img src="https://via.placeholder.com/40" className="rounded-circle me-2" alt="admin" />
              <strong>Admin</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#">Profile</a></li>
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item text-danger" href="#">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
