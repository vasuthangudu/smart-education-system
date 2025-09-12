// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Courses from "./pages/Courses";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import AdminSettings from "./pages/Settings";
import Students from "./pages/Students";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const [loggedInAdmin, setLoggedInAdmin] = useState(null);

  return (
    <Router>
      {/* Sidebar visible only after login */}
      {loggedInAdmin && <Sidebar setLoggedInAdmin={setLoggedInAdmin} />}

      <div
        className="content p-4"
        style={{ marginLeft: loggedInAdmin ? "250px" : "0", width: "100%" }}
      >
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
    </Router>
  );
}

export default App;
