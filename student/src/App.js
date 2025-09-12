import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import Assignments from "./pages/Assignments";
import Progress from "./pages/Progress";
import Communication from "./pages/Communication";
import Notifications from "./pages/Notifications";
import StudentLogin from "./pages/StudentLogin";

const Layout = ({ children }) => {
  const location = useLocation();
  const { student } = useAuth();
  const hideLayout = location.pathname === "/login";

  // redirect to login if not authenticated
  if (!student && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#f8fafc" }}>
      {!hideLayout && <Sidebar />}
      <div style={{ marginLeft: hideLayout ? "0" : "230px", padding: "20px" }}>
        {!hideLayout && <Topbar />}
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
