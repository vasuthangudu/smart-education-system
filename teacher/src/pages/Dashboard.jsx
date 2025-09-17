import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios.get("http://localhost:5005/api/courses").then((res) => setCourses(res.data));
    axios.get("http://localhost:5008/api/teachers").then((res) => setTeachers(res.data));
    axios.get("http://localhost:5008/api/students").then((res) => setStudents(res.data));
    axios.get("http://localhost:6001/results").then((res) => setResults(res.data));
    axios.get("http://localhost:5007/api/messages").then((res) => setMessages(res.data));
  }, []);

  const filteredMessages =
    filter === "All" ? messages : messages.filter((m) => m.receiver === filter);

  const videoCounts = {};
  courses.forEach((c) => {
    const subject = c.subject || "Unknown";
    const count = Array.isArray(c.videos) ? c.videos.length : 0;
    videoCounts[subject] = (videoCounts[subject] || 0) + count;
  });

  const pieData = {
    labels: Object.keys(videoCounts),
    datasets: [
      {
        data: Object.values(videoCounts),
        backgroundColor: [
          "#6366f1",
          "#f97316",
          "#22c55e",
          "#e11d48",
          "#9333ea",
          "#06b6d4",
        ],
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Students",
        data: [200, 400, 600, 800, 1000, 1200],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.1)",
        tension: 0.4,
      },
      {
        label: "Teachers",
        data: [20, 30, 50, 60, 70, 85],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        tension: 0.4,
      },
    ],
  };

  const scoresByQuiz = {};
  results.forEach((r) => {
    const quiz = r.quizTitle || "Unknown";
    scoresByQuiz[quiz] = scoresByQuiz[quiz] || [];
    scoresByQuiz[quiz].push(r.score);
  });
  const quizLabels = Object.keys(scoresByQuiz);
  const avgScores = quizLabels.map((quiz) => {
    const scores = scoresByQuiz[quiz];
    const total = scores.reduce((a, b) => a + b, 0);
    return (total / scores.length).toFixed(2);
  });

  const barData = {
    labels: quizLabels,
    datasets: [
      {
        label: "Average Score",
        data: avgScores,
        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(139,92,246,0.8)",
          "rgba(6,182,212,0.8)",
          "rgba(34,197,94,0.8)",
          "rgba(249,115,22,0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: { legend: { position: "top" } },
  };

  return (
    <div className="dashboard-container py-4">
      <div className="container">
        {/* Stat Cards */}
        <div className="row g-4 mb-4">
          {[
            { title: "Students", value: students.length, icon: "bi bi-people-fill gradient-blue" },
            { title: "Teachers", value: teachers.length, icon: "bi bi-person-video3 gradient-green" },
            { title: "Courses", value: courses.length, icon: "bi bi-journal-bookmark-fill gradient-purple" },
            { title: "Quizzes Taken", value: results.length, icon: "bi bi-pencil-square gradient-orange" },
          ].map((card, i) => (
            <div key={i} className="col-md-3 col-6">
              <div className="card stat-card text-center p-3 shadow-lg border-0">
                <i className={`${card.icon} display-6 d-block mb-2`}></i>
                <h6>{card.title}</h6>
                <h4 className="fw-bold">{card.value}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6 col-md-12">
            <div className="card chart-card p-3 shadow-lg border-0" style={{ height: "300px" }}>
              <h6>Student vs Teacher Growth</h6>
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="card chart-card p-3 shadow-lg border-0" style={{ height: "300px" }}>
              <h6>Course Distribution (Videos)</h6>
              {courses.length ? <Pie data={pieData} options={chartOptions} /> : <p>Loading...</p>}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card chart-card p-3 shadow-lg border-0" style={{ height: "320px" }}>
              <h6>Average Exam Scores by Quiz</h6>
              {results.length ? <Bar data={barData} options={chartOptions} /> : <p>Loading...</p>}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card shadow-lg border-0 p-3 mb-4">
          <div className="d-flex justify-content-between mb-2 flex-wrap">
            <h6>Recent Notifications</h6>
            <select
              className="form-select w-auto"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          <ul className="list-group list-group-flush">
            {filteredMessages.slice(0, 5).map((m) => (
              <li
                key={m._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{m.subject || "No Subject"}:</strong> {m.message}
                </span>
                <small className="text-muted">
                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}
                </small>
              </li>
            ))}
            {filteredMessages.length === 0 && <p className="text-muted">No notifications.</p>}
          </ul>
        </div>

        {/* Tables */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-3">
              <h6>Recent Students</h6>
              {students.length ? (
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 5).map((s, i) => (
                      <tr key={s._id || i}>
                        <td>{i + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.password}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No students found.</p>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-lg border-0 p-3">
              <h6>Recent Teachers</h6>
              {teachers.length ? (
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.slice(0, 5).map((t, i) => (
                      <tr key={t._id || i}>
                        <td>{i + 1}</td>
                        <td>{t.name}</td>
                        <td>{t.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No teachers found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
