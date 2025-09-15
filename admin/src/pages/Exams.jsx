import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API = "http://localhost:6001";

export default function AdminExamResults() {
  const [results, setResults] = useState([]);
  const [filterRoll, setFilterRoll] = useState(""); // New state for Roll filter
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get(`${API}/results`)
      .then(res => setResults(res.data || []))
      .catch(err => console.error("Failed to fetch results:", err));
  }, []);

  const filtered = useMemo(() => {
    return results.filter(r =>
      (!filterRoll || r.studentRoll.includes(filterRoll)) // Filter by Roll
    );
  }, [results, filterRoll]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exam Results", 14, 16);
    const tableColumn = ["Student Roll", "Quiz Title", "Score", "Date"];
    const tableRows = filtered.map(r => [r.studentRoll, r.quizTitle, r.score, new Date(r.date).toLocaleDateString()]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("exam_results.pdf");
  };

  const exportCSV = () => {
    const csvHeader = ["Student Roll,Quiz Title,Score,Date"];
    const csvRows = filtered.map(r => `${r.studentRoll},${r.quizTitle},${r.score},${new Date(r.date).toLocaleDateString()}`);
    const blob = new Blob([csvHeader.concat(csvRows).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-center fw-bold text-white rounded-pill p-3"
          style={{
            background: "linear-gradient(135deg, #ff7eb3 0%, #ff758c 50%, #ff4b1f 100%)",
            boxShadow: "0 6px 20px rgba(255, 75, 31, 0.4), 0 0 15px rgba(255, 120, 150, 0.3)",
            letterSpacing: "1px",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            fontSize: "1.8rem"
          }}>
        📊 Exam Results Dashboard
      </h3>

      {/* Roll Number Filter */}
      <div className="row mb-3 g-2">
        <div className="col-md-3 col-6">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="Filter by Roll No"
            value={filterRoll}
            onChange={e => setFilterRoll(e.target.value)}
          />
        </div>
        <div className="col-md-9 text-end">
          <button className="btn btn-gradient me-2" onClick={exportPDF}>Export PDF</button>
          <button className="btn btn-gradient2" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive shadow rounded" style={{ overflowX: "auto" }}>
        <table className="table table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Student Roll</th>
              <th>Quiz Title</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(r => (
              <tr key={r._id}>
                <td>{r.studentRoll}</td>
                <td>{r.quizTitle}</td>
                <td className={r.score < 50 ? "text-danger fw-bold" : "text-success fw-bold"}>{r.score}</td>
                <td>{new Date(r.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span className="fw-bold">Page {page} of {totalPages}</span>
        <button className="btn btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {/* Styles */}
      <style>{`
        .btn-gradient { background: linear-gradient(45deg,#ff512f,#dd2476); color:white; border:none; }
        .btn-gradient:hover { transform: scale(1.05); }
        .btn-gradient2 { background: linear-gradient(45deg,#36d1dc,#5b86e5); color:white; border:none; }
        .btn-gradient2:hover { transform: scale(1.05); }
      `}</style>
    </div>
  );
}
