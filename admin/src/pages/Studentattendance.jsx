// src/StudentDataForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:5009/api/students";

export default function StudentDataForm() {
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    branch: "",
    section: "",
    semester: "",
    subject: "",
  });
  const [localStudents, setLocalStudents] = useState([]);
  const [savedStudents, setSavedStudents] = useState([]);
  const [editStudent, setEditStudent] = useState(null);
  const [filters, setFilters] = useState({ branch: "", semester: "", search: "" });

  const branches = ["CSE", "ME", "EE"];
  const sections = ["A", "B", "C"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const subjects = ["Math", "Science", "English"];

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addLocalStudent = (e) => {
    e.preventDefault();
    const { studentId, studentName, branch, section, semester, subject } = form;
    // studentId is optional (server will generate if missing)
    if (!studentName || !branch || !section || !semester || !subject) {
      alert("Please fill Name, Branch, Section, Semester and Subject.");
      return;
    }
    setLocalStudents([...localStudents, { studentId, studentName, branch, section, semester, subject }]);
    setForm({ studentId: "", studentName: "", branch: "", section: "", semester: "", subject: "" });
  };

  const submitAll = async () => {
    if (localStudents.length === 0) { alert("No new students to submit."); return; }
    try {
      const res = await axios.post(API, localStudents);
      // server returns { students: all, insertedCount }
      setSavedStudents(res.data.students || []);
      setLocalStudents([]);
      alert("Saved successfully.");
    } catch (err) {
      const data = err.response?.data;
      if (data?.students) setSavedStudents(data.students);
      alert(data?.error || data?.message || "Save failed. Check console for details.");
      console.error("submitAll error:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filters.branch) params.branch = filters.branch;
      if (filters.semester) params.semester = filters.semester;
      if (filters.search) params.search = filters.search;
      const res = await axios.get(API, { params });
      setSavedStudents(res.data || []);
    } catch (err) {
      console.error("fetchStudents error:", err);
      alert("Failed to fetch students.");
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await axios.delete(`${API}/${id}`);
      setSavedStudents(res.data.students || []);
    } catch (err) {
      console.error("delete error:", err);
      alert("Delete failed.");
    }
  };

  const startEdit = (student) => {
    setEditStudent(student);
    setForm({
      studentId: student.studentId || "",
      studentName: student.studentName || "",
      branch: student.branch || "",
      section: student.section || "",
      semester: student.semester || "",
      subject: student.subject || "",
    });
  };

  const updateStudent = async () => {
    if (!editStudent) return;
    try {
      const res = await axios.put(`${API}/${editStudent._id}`, form);
      setSavedStudents(res.data.students || []);
      setEditStudent(null);
      setForm({ studentId: "", studentName: "", branch: "", section: "", semester: "", subject: "" });
      alert("Updated.");
    } catch (err) {
      console.error("update error:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow p-4">
        <h2 className="text-primary text-center mb-4">📋 Student Management</h2>

        <form className="row g-3 mb-3" onSubmit={editStudent ? (e) => { e.preventDefault(); updateStudent(); } : addLocalStudent}>
          <div className="col-md-2">
            <input placeholder="Student ID (optional)" name="studentId" value={form.studentId} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-3">
            <input placeholder="Name" name="studentName" value={form.studentName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-2">
            <select name="branch" value={form.branch} onChange={handleChange} className="form-select" required>
              <option value="">Branch</option>{branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-md-1">
            <select name="section" value={form.section} onChange={handleChange} className="form-select" required>
              <option value="">Sec</option>{sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-1">
            <select name="semester" value={form.semester} onChange={handleChange} className="form-select" required>
              <option value="">Sem</option>{semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select name="subject" value={form.subject} onChange={handleChange} className="form-select" required>
              <option value="">Subject</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-1 d-flex">
            <button type="submit" className={`btn ${editStudent ? "btn-warning" : "btn-primary"} w-100`}>
              {editStudent ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {localStudents.length > 0 && (
          <div className="mb-3">
            <h5>📝 Pending Students</h5>
            <ul className="list-group">
              {localStudents.map((s, i) => <li key={i} className="list-group-item">{s.studentId || "(will be generated)"} — {s.studentName}</li>)}
            </ul>
            <button className="btn btn-success mt-2" onClick={submitAll}>Submit All</button>
          </div>
        )}

        <div className="mb-3 d-flex gap-2">
          <select className="form-select w-auto" value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })}>
            <option value="">All Branches</option>{branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select className="form-select w-auto" value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })}>
            <option value="">All Semesters</option>{semesters.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="form-control w-auto" placeholder="Search ID/Name" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <button className="btn btn-info" onClick={fetchStudents}>Filter/Search</button>
        </div>

        {savedStudents.length === 0 ? <p>No students found.</p> : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-success">
                <tr>
                  <th>#</th><th>ID</th><th>Name</th><th>Branch</th><th>Sec</th><th>Sem</th><th>Subject</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedStudents.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>{s.studentId}</td>
                    <td>{s.studentName}</td>
                    <td>{s.branch}</td>
                    <td>{s.section}</td>
                    <td>{s.semester}</td>
                    <td>{s.subject}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(s)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteStudent(s._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
