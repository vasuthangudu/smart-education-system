import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Studentattendance from "./pages/Studentattendance";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [loggedInAdmin, setLoggedInAdmin] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setLoggedInAdmin(null);
    localStorage.removeItem("loggedAdmin");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      {loggedInAdmin && (
        <Sidebar
          setLoggedInAdmin={setLoggedInAdmin}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
      <div
        className="d-flex flex-column"
        style={{
          marginLeft: loggedInAdmin && !isMobile ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {loggedInAdmin && (
          <Topbar
            admin={loggedInAdmin}
            onLogout={handleLogout}
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            isMobile={isMobile}
          />
        )}
        <main className="flex-grow-1 p-3">
          <Routes>
            <Route path="/login" element={<Login setLoggedInAdmin={setLoggedInAdmin} />} />
            {loggedInAdmin ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/students" element={<Students />} />
                <Route path="/attendance" element={<Studentattendance />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/timetable" element={<Timetable />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="/profile" element={<Profile loggedInAdmin={loggedInAdmin} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </main>
        {loggedInAdmin && <Footer />}
      </div>
    </Router>
  );
}

export default App;
