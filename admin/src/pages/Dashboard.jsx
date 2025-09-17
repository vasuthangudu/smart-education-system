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
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css"; // Custom styles

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

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5005/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5008/api/teachers")
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5008/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:6001/results")
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  const videoCounts = {};
  courses.forEach((course) => {
    const subject = course.subject || "Unknown";
    const videoCount = Array.isArray(course.videos) ? course.videos.length : 0;
    videoCounts[subject] = (videoCounts[subject] || 0) + videoCount;
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
  results.forEach((res) => {
    const quiz = res.quizTitle || "Unknown";
    scoresByQuiz[quiz] = scoresByQuiz[quiz] || [];
    scoresByQuiz[quiz].push(res.score);
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
        backgroundColor: "linear-gradient(90deg,#9333ea,#6366f1)",
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { boxWidth: 12 } },
    },
  };

  return (
    <div className="container my-4 dashboard">
      <h3 className="mb-4 text-gradient">📊 Dashboard Overview</h3>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total Students", value: students.length, icon: "👩‍🎓" },
          { title: "Total Teachers", value: teachers.length, icon: "👨‍🏫" },
          { title: "Total Courses", value: courses.length, icon: "📚" },
          { title: "Quizzes Taken", value: results.length, icon: "📝" },
        ].map((card, i) => (
          <div key={i} className="col-md-3 col-6">
            <div className="card shadow-sm stat-card text-center p-3 h-100">
              <h1 className="display-6">{card.icon}</h1>
              <h6>{card.title}</h6>
              <h3>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 hover-3d" style={{ height: "260px" }}>
            <h6>Student vs Teacher Growth</h6>
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3 hover-3d" style={{ height: "260px" }}>
            <h6>Course Distribution (Videos)</h6>
            {courses.length > 0 ? (
              <Pie data={pieData} options={chartOptions} />
            ) : (
              <p className="text-muted">Loading course data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm p-3 hover-3d" style={{ height: "260px" }}>
            <h6>Average Exam Scores by Quiz</h6>
            {results.length > 0 ? (
              <Bar data={barData} options={chartOptions} />
            ) : (
              <p className="text-muted">Loading results...</p>
            )}
          </div>
        </div>
      </div>

      {/* Students & Teachers */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 hover-3d">
            <h6>Students</h6>
            {students.length > 0 ? (
              <table className="table table-hover mt-2">
                <thead className="table-gradient">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s, idx) => (
                    <tr key={s._id || idx}>
                      <td>{idx + 1}</td>
                      <td>{s.name}</td>
                      <td>{s.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No students found.</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3 hover-3d">
            <h6>Teachers</h6>
            {teachers.length > 0 ? (
              <table className="table table-hover mt-2">
                <thead className="table-gradient">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.slice(0, 5).map((t, idx) => (
                    <tr key={t._id || idx}>
                      <td>{idx + 1}</td>
                      <td>{t.name}</td>
                      <td>{t.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No teachers found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
