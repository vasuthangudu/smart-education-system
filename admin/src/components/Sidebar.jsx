import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ setLoggedInAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "bi-house" },
    { path: "/users", label: "Users", icon: "bi-people" },
    { path: "/students", label: "Students", icon: "bi-people" },
    { path: "/courses", label: "Courses", icon: "bi-book" },
    { path: "/timetable", label: "Timetable", icon: "bi-calendar-event" },
    { path: "/exams", label: "Exams", icon: "bi-pencil-square" },
    { path: "/reports", label: "Reports", icon: "bi-bar-chart" },
    { path: "/notifications", label: "Notifications", icon: "bi-bell" },
    { path: "/settings", label: "Settings", icon: "bi-gear" },
    { path: "/profile", label: "Profile", icon: "bi-person-circle" },
  ];

  const handleLogout = () => {
    // Clear logged-in user (optional if you store state globally)
    if (setLoggedInAdmin) setLoggedInAdmin(null);

    // Navigate to login page
    navigate("/");
  };

  return (
    <div
      className="sidebar bg-dark text-white position-fixed vh-100 d-flex flex-column justify-content-between"
      style={{ width: "250px" }}
    >
      <div>
        <h4 className="text-center py-3">🎓 Admin</h4>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`d-block px-4 py-2 text-decoration-none ${
              location.pathname === item.path
                ? "bg-secondary text-white"
                : "text-light"
            }`}
          >
            <i className={`bi ${item.icon} me-2`}></i> {item.label}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-3 border-top">
        <button
          onClick={handleLogout}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
