import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyCourses from "./pages/MyCourses";
import Assignments from "./pages/Assignments";
import Progress from "./pages/Progress";
import Communication from "./pages/Communication";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <div style={{ fontFamily: "Segoe UI, sans-serif", background: "#f8fafc" }}>
        <Sidebar />
        <div className="main-content" style={{ marginLeft: "230px", padding: "20px" }}>
          <Topbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
