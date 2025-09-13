// src/components/Attendance.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Attendance() {
  const branchSections = { CSE: ["A", "B"], ME: ["A", "B"], EE: ["A", "B"] };
  const teacherSubjects = ["Math", "Science", "English"];

  const [studentsData, setStudentsData] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentsError, setStudentsError] = useState(null);

  const [attendanceSelections, setAttendanceSelections] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filters, setFilters] = useState({
    branch: "",
    section: "",
    semester: "",
    subject: "",
    period: "",
    date: "",
  });
  const [historyFilters, setHistoryFilters] = useState({
    branch: "",
    section: "",
    semester: "",
    subject: "",
    search: "",
  });

  // === Fetch Students from Backend ===
  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setStudentsError(null);
      const res = await fetch("http://localhost:5009/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      // Map API data to required format
      const mapped = data.map((s) => ({
        id: s.studentId,
        name: s.studentName,
        branch: s.branch,
        section: s.section,
        semester: s.semester,
        subject: s.subject,
      }));
      setStudentsData(mapped);
    } catch (err) {
      console.error("Students fetch error:", err);
      setStudentsError("❌ Failed to load students. Check API!");
    } finally {
      setLoadingStudents(false);
    }
  };

  // === Fetch Attendance History from Backend ===
  const fetchHistory = async () => {
    try {
      const query = new URLSearchParams(historyFilters).toString();
      const res = await fetch(`http://localhost:8080/api/attendance?${query}`);
      if (!res.ok) throw new Error("Failed to fetch attendance history");
      const data = await res.json();
      setAttendanceRecords(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch attendance history. Check backend!");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [historyFilters]);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleHistoryFilterChange = (e) =>
    setHistoryFilters({ ...historyFilters, [e.target.name]: e.target.value });

  const filteredStudents = studentsData.filter(
    (s) =>
      (!filters.branch || s.branch === filters.branch) &&
      (!filters.section || s.section === filters.section) &&
      (!filters.semester || s.semester === filters.semester)
  );

  const bulkMark = (status) => {
    const updated = {};
    filteredStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceSelections(updated);
  };

  const saveAttendance = async () => {
    const { branch, section, semester, subject, period, date } = filters;
    if (!branch || !section || !semester || !subject || !period || !date) {
      alert("Select all filters before saving!");
      return;
    }
    if (filteredStudents.length === 0) {
      alert("No students to save!");
      return;
    }
    const newRecords = filteredStudents.map((s) => ({
      id: s.id,
      name: s.name,
      branch,
      section,
      semester,
      subject,
      date,
      period,
      status: attendanceSelections[s.id] || "Absent",
    }));
    try {
      const res = await fetch("http://localhost:8080/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecords),
      });
      if (!res.ok) throw new Error("Failed to save attendance");
      alert("✅ Attendance Saved Successfully!");
      fetchHistory();
      setAttendanceSelections({});
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save attendance. Check backend!");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n");
      const csvRecords = lines
        .map((l) => l.split(","))
        .filter((arr) => arr[0])
        .map(
          ([id, name, branch, section, semester, subject, date, period, status]) => ({
            id,
            name,
            branch,
            section,
            semester,
            subject,
            date,
            period,
            status,
          })
        );
      setAttendanceRecords((prev) => [...prev, ...csvRecords]);
    };
    reader.readAsText(file);
  };

  const filteredHistory = attendanceRecords.filter(
    (r) =>
      (!historyFilters.branch || r.branch === historyFilters.branch) &&
      (!historyFilters.section || r.section === historyFilters.section) &&
      (!historyFilters.semester || r.semester === historyFilters.semester) &&
      (!historyFilters.subject || r.subject === historyFilters.subject) &&
      r.name.toLowerCase().includes(historyFilters.search.toLowerCase())
  );

  const totalStudents = filteredHistory.length;
  const totalPresent = filteredHistory.filter((r) => r.status === "Present").length;
  const totalAbsent = filteredHistory.filter((r) => r.status === "Absent").length;

  return (
    <div className="container my-4">
      <h2 className="text-primary mb-4">📋 Teacher Attendance Panel</h2>

      {loadingStudents && <div className="alert alert-info">Loading students...</div>}
      {studentsError && <div className="alert alert-danger">{studentsError}</div>}

      {/* === Filters for Marking === */}
      <div className="row g-2 mb-3">
        {["branch", "section", "semester", "subject", "period"].map((key) => (
          <div className="col-md-2" key={key}>
            {key === "branch" && (
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Branch</option>
                {Object.keys(branchSections).map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            )}
            {key === "section" && (
              <select
                name="section"
                value={filters.section}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Section</option>
                {filters.branch &&
                  branchSections[filters.branch].map((sec) => (
                    <option key={sec}>{sec}</option>
                  ))}
              </select>
            )}
            {key === "semester" && (
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Semester</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            )}
            {key === "subject" && (
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Subject</option>
                {teacherSubjects.map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>
            )}
            {key === "period" && (
              <select
                name="period"
                value={filters.period}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">Period</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            )}
          </div>
        ))}
        <div className="col-md-2">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="form-control"
          />
        </div>
      </div>

      {/* === Attendance Table === */}
      <h5>Mark Attendance</h5>
      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Excused</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              {["Present", "Absent", "Late", "Excused"].map((status) => (
                <td key={status}>
                  <input
                    type="radio"
                    name={s.id}
                    value={status}
                    checked={attendanceSelections[s.id] === status}
                    onChange={() =>
                      setAttendanceSelections({ ...attendanceSelections, [s.id]: status })
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={saveAttendance}>
          Save Attendance
        </button>
        {["Present", "Absent", "Late", "Excused"].map((status) => (
          <button
            key={status}
            className="btn btn-outline-secondary me-2"
            onClick={() => bulkMark(status)}
          >
            Mark All {status}
          </button>
        ))}
        <input type="file" className="form-control d-inline-block w-auto" onChange={handleFileUpload} />
      </div>

      {/* === Attendance History === */}
      <h5>Attendance History</h5>
      <div className="row g-2 mb-2">
        {["branch", "section", "semester", "subject"].map((key) => (
          <div className="col-md-2" key={key}>
            <select
              name={key}
              value={historyFilters[key]}
              onChange={handleHistoryFilterChange}
              className="form-select"
            >
              <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
              {key === "branch" &&
                Object.keys(branchSections).map((b) => <option key={b}>{b}</option>)}
              {key === "section" &&
                historyFilters.branch &&
                branchSections[historyFilters.branch].map((sec) => <option key={sec}>{sec}</option>)}
              {key === "semester" && (
                <>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </>
              )}
              {key === "subject" &&
                teacherSubjects.map((sub) => <option key={sub}>{sub}</option>)}
            </select>
          </div>
        ))}
        <div className="col-md-4">
          <input
            type="text"
            name="search"
            value={historyFilters.search}
            placeholder="Search Student..."
            className="form-control"
            onChange={handleHistoryFilterChange}
          />
        </div>
      </div>

      <div className="mb-2">
        <strong>Total:</strong> {totalStudents} | <strong>Present:</strong> {totalPresent} |{" "}
        <strong>Absent:</strong> {totalAbsent}
      </div>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Section</th>
            <th>Semester</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Period</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.map((r, idx) => (
            <tr
              key={idx}
              className={
                r.status === "Absent"
                  ? "table-danger"
                  : r.status === "Present"
                  ? "table-success"
                  : ""
              }
            >
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.branch}</td>
              <td>{r.section}</td>
              <td>{r.semester}</td>
              <td>{r.subject}</td>
              <td>{r.date}</td>
              <td>{r.period}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
