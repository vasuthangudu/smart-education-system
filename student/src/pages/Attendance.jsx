import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Chart, registerables } from "chart.js";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

Chart.register(...registerables);

export default function AttendanceDashboard() {
  const { student } = useAuth();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Fetch attendance
  useEffect(() => {
    if (!student) return;
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/attendance");
        const data = await res.json();
        const studentRecords = data.filter(
          (r) =>
            r.name === student.rollNo ||
            r.id === student.rollNo ||
            r.name === student.name
        );
        setRecords(studentRecords);
        setFilteredRecords(studentRecords);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [student]);

  // Filters
  useEffect(() => {
    let filtered = [...records];
    if (statusFilter) filtered = filtered.filter((r) => r.status === statusFilter);
    if (searchQuery)
      filtered = filtered.filter((r) =>
        `${r.subject} ${r.date}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredRecords(filtered);
  }, [searchQuery, statusFilter, records]);

  // Chart
  useEffect(() => {
    if (!filteredRecords.length) {
      if (chartInstance.current) chartInstance.current.destroy();
      return;
    }
    const counts = {};
    filteredRecords.forEach((r) => {
      counts[r.subject] ??= { total: 0, present: 0 };
      counts[r.subject].total++;
      if (r.status === "Present") counts[r.subject].present++;
    });
    const labels = Object.keys(counts);
    const values = labels.map((l) =>
      Math.round((counts[l].present / counts[l].total) * 100)
    );
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Attendance %",
            data: values,
            backgroundColor: darkMode
              ? "rgba(255, 193, 7, 0.8)"
              : "rgba(13,110,253,0.8)",
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: darkMode ? "#f8f9fa" : "#212529" },
          },
          x: {
            ticks: { color: darkMode ? "#f8f9fa" : "#212529" },
          },
        },
      },
    });
  }, [filteredRecords, darkMode]);

  const total = filteredRecords.length;
  const present = filteredRecords.filter((r) => r.status === "Present").length;
  const absent = total - present;
  const percent = total ? Math.round((present / total) * 100) : 0;

  if (!student) return <p className="text-center mt-5">Please log in</p>;

  return (
    <motion.div
      className={`container mt-4 ${darkMode ? "bg-dark text-light" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ borderRadius: "12px", padding: "10px" }}
    >
      {loading ? (
        <div className="text-center display-6">Loading...</div>
      ) : (
        <>
          {/* Student Banner + Dark Mode Toggle */}
          <motion.div
            className={`d-flex align-items-center justify-content-between p-3 mb-4 rounded shadow-sm ${
              darkMode ? "bg-secondary text-white" : "bg-primary bg-gradient text-white"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="d-flex align-items-center">
              <img
                src={student.profileImage || "https://via.placeholder.com/60"}
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <div>
                <h5 className="mb-0">{student.name}</h5>
                <small>Roll No: {student.rollNo}</small>
              </div>
            </div>
            <button
              className={`btn ${darkMode ? "btn-warning" : "btn-light"} rounded-circle`}
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </motion.div>

          {/* Filters */}
          <div className="mb-4 d-flex flex-column flex-md-row gap-2">
            <input
              className="form-control"
              placeholder="Search by subject or date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          {/* Stats */}
          <div className="row text-center mb-4">
            {[
              { label: "Total", value: total, color: "bg-light text-dark" },
              { label: "Present", value: present, color: "bg-success text-white" },
              { label: "Absent", value: absent, color: "bg-danger text-white" },
              { label: "Percent", value: `${percent}%`, color: "bg-primary text-white" },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="col-md-3 mb-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`p-3 rounded shadow-sm ${s.color}`}>
                  <h6>{s.label}</h6>
                  <p className="fw-bold fs-5">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <motion.div className="card p-3 mb-4 shadow-sm">
            <canvas ref={chartRef} height="120"></canvas>
            <small className="text-muted mt-2">
              Attendance Percentage by Subject
            </small>
          </motion.div>

          {/* Table */}
          <motion.div className="table-responsive shadow-sm rounded">
            <table
              className={`table table-striped table-hover align-middle ${
                darkMode ? "table-dark" : ""
              }`}
            >
              <thead className={darkMode ? "table-secondary" : "table-primary"}>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Period</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r, idx) => (
                    <motion.tr
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      style={{
                        backgroundColor:
                          !darkMode && idx % 2 !== 0 ? "#e9f5ff" : undefined,
                      }}
                    >
                      <td>{r.date}</td>
                      <td>{r.subject}</td>
                      <td>{r.period}</td>
                      <td>
                        <span
                          className={`badge fw-bold ${
                            r.status === "Present" ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {r.status === "Present" ? "✅ Present" : "❌ Absent"}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
