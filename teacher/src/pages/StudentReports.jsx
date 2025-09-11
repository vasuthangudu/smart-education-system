import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function StudentReports() {
  const [filter, setFilter] = useState({ class: "", subject: "", quiz: "", dateFrom: "", dateTo: "" });

  // Mock data
  const students = [
    { id: 1, name: "Alice", email: "alice@mail.com", attempts: 3, score: 85, maxScore: 100, percentage: 85, grade: "A", timeTaken: "25 min", eligible: true },
    { id: 2, name: "Bob", email: "bob@mail.com", attempts: 2, score: 60, maxScore: 100, percentage: 60, grade: "C", timeTaken: "30 min", eligible: true },
    { id: 3, name: "Charlie", email: "charlie@mail.com", attempts: 1, score: 40, maxScore: 100, percentage: 40, grade: "F", timeTaken: "35 min", eligible: false },
  ];

  const quizzes = [
    { id: 1, title: "Math Quiz 1", averageScore: 70, highestScore: 95, lowestScore: 40, attempts: 3 },
    { id: 2, title: "Science Quiz 1", averageScore: 80, highestScore: 100, lowestScore: 50, attempts: 3 },
  ];

  const questions = [
    { id: 1, text: "2+2=?", correctPercent: 90, difficulty: "easy" },
    { id: 2, text: "H2O is?", correctPercent: 60, difficulty: "medium" },
    { id: 3, text: "Solve x^2+2x+1=0", correctPercent: 40, difficulty: "hard" },
  ];

  // Summary Metrics
  const totalStudents = students.length;
  const totalQuizzes = quizzes.length;
  const avgScore = (students.reduce((acc, s) => acc + s.percentage, 0) / totalStudents).toFixed(2);
  const passCount = students.filter(s => s.grade !== "F").length;
  const completionRate = ((students.filter(s => s.eligible).length / totalStudents) * 100).toFixed(2);
  const topPerformer = students.reduce((a, b) => (a.score > b.score ? a : b), students[0]).name;
  const weakestTopic = questions.reduce((a, b) => (a.correctPercent < b.correctPercent ? a : b), questions[0]).text;

  // Charts Data
  const quizScoresData = {
    labels: quizzes.map(q => q.title),
    datasets: [{ label: "Average Score", data: quizzes.map(q => q.averageScore), backgroundColor: "rgba(54, 162, 235, 0.6)" }],
  };

  const questionAnalysisData = {
    labels: questions.map(q => q.text),
    datasets: [{ label: "% Correct", data: questions.map(q => q.correctPercent), backgroundColor: "rgba(255, 99, 132, 0.6)" }],
  };

  const passFailData = {
    labels: ["Pass", "Fail"],
    datasets: [{ data: [passCount, totalStudents - passCount], backgroundColor: ["#28a745", "#dc3545"] }],
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-primary">📊 Student Reports Dashboard</h1>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3"><div className="card p-3 shadow-sm text-center"><h5>Total Students</h5><h3>{totalStudents}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 shadow-sm text-center"><h5>Quizzes Taken</h5><h3>{totalQuizzes}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 shadow-sm text-center"><h5>Avg Score</h5><h3>{avgScore}%</h3></div></div>
        <div className="col-md-3"><div className="card p-3 shadow-sm text-center"><h5>Pass / Fail</h5><h3>{passCount} / {totalStudents - passCount}</h3></div></div>
        <div className="col-md-3 mt-3"><div className="card p-3 shadow-sm text-center"><h5>Completion Rate</h5><h3>{completionRate}%</h3></div></div>
        <div className="col-md-3 mt-3"><div className="card p-3 shadow-sm text-center"><h5>Top Performer</h5><h3>{topPerformer}</h3></div></div>
        <div className="col-md-3 mt-3"><div className="card p-3 shadow-sm text-center"><h5>Weakest Topic</h5><h3>{weakestTopic}</h3></div></div>
      </div>

      {/* Filters */}
      <div className="card p-3 mb-4">
        <h5>Filters</h5>
        <div className="row">
          <div className="col"><input type="text" className="form-control" placeholder="Class" value={filter.class} onChange={e => setFilter({ ...filter, class: e.target.value })} /></div>
          <div className="col"><input type="text" className="form-control" placeholder="Subject" value={filter.subject} onChange={e => setFilter({ ...filter, subject: e.target.value })} /></div>
          <div className="col"><input type="text" className="form-control" placeholder="Quiz" value={filter.quiz} onChange={e => setFilter({ ...filter, quiz: e.target.value })} /></div>
          <div className="col"><input type="date" className="form-control" value={filter.dateFrom} onChange={e => setFilter({ ...filter, dateFrom: e.target.value })} /></div>
          <div className="col"><input type="date" className="form-control" value={filter.dateTo} onChange={e => setFilter({ ...filter, dateTo: e.target.value })} /></div>
        </div>
      </div>

      {/* Student Table */}
      <div className="card p-3 mb-4">
        <h5>Student Details</h5>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Attempts</th>
              <th>Score</th>
              <th>%</th>
              <th>Grade</th>
              <th>Time Taken</th>
              <th>Eligible</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.attempts}</td>
                <td>{s.score}/{s.maxScore}</td>
                <td>{s.percentage}%</td>
                <td>{s.grade}</td>
                <td>{s.timeTaken}</td>
                <td>{s.eligible ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quiz Analytics Charts */}
      <div className="row mb-4">
        <div className="col-md-6"><div className="card p-3 shadow-sm"><h5>Quiz Average Scores</h5><Bar data={quizScoresData} /></div></div>
        <div className="col-md-6"><div className="card p-3 shadow-sm"><h5>Pass / Fail Ratio</h5><Pie data={passFailData} /></div></div>
      </div>

      {/* Question Analysis Chart */}
      <div className="card p-3 shadow-sm mb-4">
        <h5>Question-wise Accuracy</h5>
        <Bar data={questionAnalysisData} />
      </div>

      {/* Export Buttons */}
      <div className="mb-4">
        <button className="btn btn-success me-2">Export CSV</button>
        <button className="btn btn-primary me-2">Export Excel</button>
        <button className="btn btn-danger">Export PDF</button>
      </div>
    </div>
  );
}
