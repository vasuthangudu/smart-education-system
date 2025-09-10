import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar() {
  return (
    <div
      className="sidebar position-fixed top-0 start-0 text-white"
      style={{
        width: "230px",
        height: "100vh",
        background: "#0f172a",
        paddingTop: "20px",
      }}
    >
      <h4 className="text-center mb-4">🎓 Student</h4>
      <Link to="/" className="d-block px-3 py-2 text-decoration-none text-white bg-secondary rounded mb-1">
        <i className="bi bi-house"></i> Dashboard
      </Link>
      <Link to="/profile" className="d-block px-3 py-2 text-decoration-none text-light">
        <i className="bi bi-person"></i> Profile
      </Link>
      <Link to="/courses" className="d-block px-3 py-2 text-decoration-none text-light">
        <i className="bi bi-book"></i> My Courses
      </Link>
      <Link to="/assignments" className="d-block px-3 py-2 text-decoration-none text-light">
        <i className="bi bi-pencil-square"></i> Assignments
      </Link>
      <Link to="/progress" className="d-block px-3 py-2 text-decoration-none text-light">
        <i className="bi bi-bar-chart"></i> Progress
      </Link>
      <Link to="/communication" className="d-block px-3 py-2 text-decoration-none text-light">
        <i className="bi bi-chat-dots"></i> Communication
      </Link>
      <Link to="/notifications" className="d-block px-3 py-2 text-decoration-none text-light">
        <i className="bi bi-bell"></i> Notifications
      </Link>
    </div>
  );
}
