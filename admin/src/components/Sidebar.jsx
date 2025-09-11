import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "bi-house" },
    { path: "/users", label: "Users", icon: "bi-people" },
    { path: "/Students", label: "Students", icon: "bi-people" },
    { path: "/courses", label: "Courses", icon: "bi-book" },
    { path: "/timetable", label: "Timetable", icon: "bi-calendar-event" },
    { path: "/exams", label: "Exams", icon: "bi-pencil-square" },
    { path: "/reports", label: "Reports", icon: "bi-bar-chart" },
    { path: "/notifications", label: "Notifications", icon: "bi-bell" },
    { path: "/settings", label: "Settings", icon: "bi-gear" },
  ];

  return (
    <div className="sidebar bg-dark text-white position-fixed vh-100" style={{ width: "250px" }}>
      <h4 className="text-center py-3">🎓 Admin</h4>
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`d-block px-4 py-2 text-decoration-none ${
            location.pathname === item.path ? "bg-secondary text-white" : "text-light"
          }`}
        >
          <i className={`bi ${item.icon} me-2`}></i> {item.label}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;
