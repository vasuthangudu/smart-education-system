// src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout(); // Clear auth state
    navigate("/login"); // Redirect to login page
  };

  // Function to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="sidebar position-fixed top-0 start-0 text-white d-flex flex-column justify-content-between"
      style={{
        width: "230px",
        height: "100vh",
        background: "#0f172a",
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      <div>
        <h4 className="text-center mb-4">🎓 Student</h4>

        <Link
          to="/"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-house me-2"></i> Dashboard
        </Link>

        <Link
          to="/profile"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/profile") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-person me-2"></i> Profile
        </Link>

        <Link
          to="/attendance"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/attendance") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-person-check me-2"></i> Attendance
        </Link>

        <Link
          to="/courses"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/courses") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-book me-2"></i> My Courses
        </Link>


        <Link
          to="/exam"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/exam") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-book me-2"></i> Exam
        </Link>        


        <Link
          to="/assignments"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/assignments") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-pencil-square me-2"></i> Assignments
        </Link>

     

        <Link
          to="/communication"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/communication") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-chat-dots me-2"></i> Communication
        </Link>

        <Link
          to="/notifications"
          className={`d-block px-3 py-2 text-decoration-none rounded mb-1 ${
            isActive("/notifications") ? "bg-primary text-white" : "text-light"
          }`}
        >
          <i className="bi bi-bell me-2"></i> Notifications
        </Link>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <button onClick={handleLogout} className="btn btn-danger w-75 mt-3">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </div>
    </div>
  );
}
