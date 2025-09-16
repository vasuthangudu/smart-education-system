import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Sidebar({ setLoggedInAdmin, isMobile, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "bi-house" },
    { path: "/users", label: "Users", icon: "bi-people" },
    { path: "/attendance", label: "Attendance", icon: "bi-clipboard-check" },
    { path: "/courses", label: "Courses", icon: "bi-book" },
    { path: "/exams", label: "Exams", icon: "bi-pencil-square" },
    { path: "/notifications", label: "Communication", icon: "bi-bell" },
    { path: "/Communication", label: "Notifivation", icon: "bi-bell" },

    { path: "/settings", label: "Settings", icon: "bi-gear" },
    { path: "/profile", label: "Profile", icon: "bi-person-circle" },
  ];

  const handleLogout = () => {
    if (setLoggedInAdmin) setLoggedInAdmin(null);
    navigate("/login");
  };

  return (
    <>
      <div
        className="bg-dark text-white position-fixed vh-100 d-flex flex-column justify-content-between"
        style={{
          width: "250px",
          left: isMobile ? (sidebarOpen ? "0" : "-250px") : "0",
          transition: "left 0.3s ease",
          zIndex: 1050,
        }}
      >
        <div>
          <h4 className="text-center py-3">🎓 Admin</h4>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`d-block px-4 py-2 text-decoration-none ${
                location.pathname === item.path
                  ? "bg-secondary text-white fw-bold"
                  : "text-light"
              }`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon} me-2`}></i> {item.label}
            </Link>
          ))}
        </div>
        <div className="p-3 border-top">
          <button
            onClick={handleLogout}
            className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>
      {isMobile && sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
