import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Sidebar({ onLogout }) {
  return (
    <div className="bg-dark text-white d-flex flex-column p-4 vh-100">
      {/* Header */}
      <h4 className="text-center mb-4 fw-bold">👨‍🏫 Teacher</h4>

      {/* Nav Links */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Profile
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Courses
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/timetable"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Timetable
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/assignments"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Assignments
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/exams"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Exams
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink
            to="/student-reports"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Student Reports
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink
            to="/communication"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active bg-primary text-white" : "text-white"}`
            }
          >
            Communication
          </NavLink>
        </li>
      </ul>

      {/* Logout Button */}
      <button onClick={onLogout} className="btn btn-danger w-100 mt-auto">
        Logout
      </button>
    </div>
  );
}
