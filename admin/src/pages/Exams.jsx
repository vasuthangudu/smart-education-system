import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminExamResults() {
  const [results, setResults] = useState([
    { id: 1, student: "Alice Johnson", class: "Math 101", subject: "Mathematics", marks: 85, faculty: "Prof. John", date: "2025-09-05" },
    { id: 2, student: "Bob Williams", class: "Physics 201", subject: "Physics", marks: 72, faculty: "Prof. Smith", date: "2025-09-06" },
    { id: 3, student: "Charlie Brown", class: "Math 101", subject: "Mathematics", marks: 65, faculty: "Prof. John", date: "2025-09-05" },
    { id: 4, student: "David Smith", class: "Physics 201", subject: "Physics", marks: 90, faculty: "Prof. Smith", date: "2025-09-06" },
  ]);

  const [filterClass, setFilterClass] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");

  const filtered = useMemo(() => {
    return results.filter(r =>
      (filterClass === "All" || r.class === filterClass) &&
      (filterSubject === "All" || r.subject === filterSubject)
    );
  }, [results, filterClass, filterSubject]);

  // Class-wise summary
  const classSummary = useMemo(() => {
    const summary = {};
    results.forEach(r => {
      if (!summary[r.class]) summary[r.class] = { total: 0, count: 0, highest: 0, lowest: 100, pass: 0, fail: 0 };
      summary[r.class].total += r.marks;
      summary[r.class].count++;
      summary[r.class].highest = Math.max(summary[r.class].highest, r.marks);
      summary[r.class].lowest = Math.min(summary[r.class].lowest, r.marks);
      if (r.marks >= 50) summary[r.class].pass++;
      else summary[r.class].fail++;
    });
    for (let cls in summary) {
      summary[cls].average = (summary[cls].total / summary[cls].count).toFixed(2);
    }
    return summary;
  }, [results]);

  // Top performers
  const topPerformers = useMemo(() => {
    return [...results].sort((a, b) => b.marks - a.marks).slice(0, 3);
  }, [results]);

  const classes = Array.from(new Set(results.map(r => r.class)));
  const subjects = Array.from(new Set(results.map(r => r.subject)));

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Exam Results", 14, 16);
    const tableColumn = ["Student", "Class", "Subject", "Marks", "Faculty", "Date"];
    const tableRows = [];

    filtered.forEach(r => {
      const row = [r.student, r.class, r.subject, r.marks, r.faculty, r.date];
      tableRows.push(row);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("exam_results.pdf");
  };

  // Export CSV
  const exportCSV = () => {
    const csvHeader = ["Student,Class,Subject,Marks,Faculty,Date"];
    const csvRows = filtered.map(r => `${r.student},${r.class},${r.subject},${r.marks},${r.faculty},${r.date}`);
    const csvContent = [...csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3 text-primary">Exam Results Dashboard</h3>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select className="form-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option>All</option>
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option>All</option>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success me-2" onClick={exportPDF}>Export PDF</button>
          <button className="btn btn-secondary" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div className="card mb-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Faculty</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className={r.marks < 50 ? "table-danger" : ""}>
                  <td>{r.student}</td>
                  <td>{r.class}</td>
                  <td>{r.subject}</td>
                  <td>{r.marks}</td>
                  <td>{r.faculty}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="text-center">No results found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Class-wise Summary */}
      <div className="row mb-4">
        {Object.entries(classSummary).map(([cls, s]) => (
          <div className="col-md-4 mb-3" key={cls}>
            <div className="card border-info">
              <div className="card-body">
                <h5 className="card-title">{cls}</h5>
                <p>Average Marks: {s.average}</p>
                <p>Highest Marks: {s.highest}</p>
                <p>Lowest Marks: {s.lowest}</p>
                <p>Pass: {s.pass} | Fail: {s.fail}</p>
                <p>Total Students: {s.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers */}
      <div className="card mb-4 border-success">
        <div className="card-body">
          <h5 className="card-title text-success">Top Performers</h5>
          <ul className="list-group list-group-flush">
            {topPerformers.map(t => (
              <li key={t.id} className="list-group-item">
                {t.student} - {t.marks} ({t.subject})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
