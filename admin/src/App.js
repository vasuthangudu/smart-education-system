// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import AdminSettings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

function App() {
  const [loggedInAdmin, setLoggedInAdmin] = useState(null);

  const handleLogout = () => {
    setLoggedInAdmin(null);
    localStorage.removeItem("loggedAdmin");
  };

  return (
    <Router>
      {/* Sidebar visible only after login */}
      {loggedInAdmin && <Sidebar setLoggedInAdmin={setLoggedInAdmin} />}

      <div
        className="content d-flex flex-column"
        style={{ marginLeft: loggedInAdmin ? "250px" : "0", minHeight: "100vh" }}
      >
        {/* Topbar visible only after login */}
        {loggedInAdmin && <Topbar admin={loggedInAdmin} onLogout={handleLogout} />}

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <Routes>
            {/* Public Login Route */}
            <Route
              path="/login"
              element={<Login setLoggedInAdmin={setLoggedInAdmin} />}
            />

            {/* Protected Routes */}
            {loggedInAdmin ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/students" element={<Students />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route
                  path="/profile"
                  element={<Profile loggedInAdmin={loggedInAdmin} />}
                />
              </>
            ) : (
              // Redirect any unknown route to login if not authenticated
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </div>

        {/* Footer visible only after login */}
        {loggedInAdmin && <Footer />}
      </div>
    </Router>
  );
}

export default App;
