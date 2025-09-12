import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import Timetable from "./pages/Timetable";
import Assignments from "./pages/Assignments";
import Exams from "./pages/Exams";
import StudentReports from "./pages/StudentReports";
import Communication from "./pages/Communication";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

export default function App() {
  const [teachers, setTeachers] = useState([]);
  const [loggedTeacher, setLoggedTeacher] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch teacher data from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teachers")
      .then((res) => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching teachers:", err);
        setError("Failed to load teacher data. Please try again.");
        setLoading(false);
      });
  }, []);

  // 🔹 Handle login by checking API data
  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value.trim();

    const teacher = teachers.find(
      (t) => t.email.toLowerCase() === email && t.password === password
    );

    if (teacher) {
      setLoggedTeacher(teacher);
      setError("");
      localStorage.setItem("loggedTeacherId", teacher._id || teacher.id);
    } else {
      setError("Invalid email or password...");
    }
  };

  const handleLogout = () => {
    setLoggedTeacher(null);
    localStorage.removeItem("loggedTeacherId");
  };

  // 🔹 Show loading state while fetching
  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex">
        {loggedTeacher && <Sidebar onLogout={handleLogout} />}
        <div className="flex-grow-1">
          {loggedTeacher && <Topbar teacher={loggedTeacher} />}

          {!loggedTeacher ? (
            <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
              <h2 className="mb-4">Teacher Login</h2>
              <form
                onSubmit={handleLogin}
                className="p-4 shadow rounded bg-white"
                style={{ maxWidth: "400px", width: "100%" }}
              >
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    required
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary w-100">
                  Log In
                </button>
              </form>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/profile"
                element={<Profile teacher={loggedTeacher} />}
              />
              <Route path="/courses" element={<Courses />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/student-reports" element={<StudentReports />} />
              <Route path="/communication" element={<Communication />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}
