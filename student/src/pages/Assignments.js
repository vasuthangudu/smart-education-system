import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5007/api/assignments";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [view, setView] = useState("list"); // "list", "submit", "submissions"
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterTeacher, setFilterTeacher] = useState("All");
  const [currentAssignment, setCurrentAssignment] = useState(null);

  // Fetch assignments from backend
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(API_URL);
      setAssignments(res.data);
      if (res.data.length > 0 && !currentAssignment) {
        setCurrentAssignment(res.data[0]);
      }
    } catch (err) {
      toast.error("Failed to fetch assignments.");
    }
  };

  // Fetch submissions from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("submissions")) || [];
    setSubmissions(saved);
  }, []);

  // Save submissions to localStorage
  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }, [submissions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAssignment) {
      toast.warning("Please select an assignment first!");
      return;
    }
    const form = e.target;
    const files = form.files.files ? Array.from(form.files.files).map(f => f.name) : [];
    const newSubmission = {
      id: Date.now(),
      student: form.student.value,
      subject: currentAssignment.subject,
      teacher: currentAssignment.teacher,
      description: form.description.value,
      files,
      submittedAt: new Date().toISOString(),
    };

    // Save to local state
    setSubmissions([...submissions, newSubmission]);

    // Optionally send to backend
    try {
      await axios.post(`${API_URL}/${currentAssignment._id}/submit`, newSubmission);
      toast.success("Assignment submitted successfully!");
      form.reset();
      setView("submissions");
    } catch {
      toast.error("Failed to submit assignment.");
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    const subjectMatch = filterSubject === "All" || a.subject === filterSubject;
    const teacherMatch = filterTeacher === "All" || a.teacher === filterTeacher;
    return subjectMatch && teacherMatch;
  });

  const getTimeRemaining = (dueDate) => {
    if (!dueDate) return "No due date";
    const diff = new Date(dueDate) - new Date();
    if (diff <= 0) return "Overdue";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return `${days}d ${hours}h left`;
  };

  return (
    <div className="container my-4">
      <h2 className="text-primary mb-4">📋 Student Assignments</h2>

      {/* Navigation Buttons */}
      <div className="mb-4">
        <button
          className={`btn me-2 ${view === "list" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("list")}
        >
          View Assignments
        </button>
        <button
          className={`btn me-2 ${view === "submit" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => {
            if (!currentAssignment && assignments.length > 0) {
              setCurrentAssignment(assignments[0]);
            }
            setView("submit");
          }}
        >
          Submit Assignment
        </button>
        <button
          className={`btn ${view === "submissions" ? "btn-info" : "btn-outline-info"}`}
          onClick={() => setView("submissions")}
        >
          My Submissions
        </button>
      </div>

      {/* Assignment List */}
      {view === "list" && (
        <>
          {/* Filters */}
          <div className="row g-2 mb-3">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="All">All Subjects</option>
                {[...new Set(assignments.map(a => a.subject))].map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
              >
                <option value="All">All Teachers</option>
                {[...new Set(assignments.map(a => a.teacher))].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            {filteredAssignments.map((a) => (
              <div className="col-md-6 mb-3" key={a._id}>
                <div
                  className={`card shadow-sm ${currentAssignment && currentAssignment._id === a._id ? "border-primary" : ""}`}
                  onClick={() => setCurrentAssignment(a)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5>{a.title}</h5>
                    <p className="text-muted mb-1">
                      Subject: {a.subject} | Teacher: {a.teacher}
                    </p>
                    <p className="mb-1">Due: {a.dueDate ? new Date(a.dueDate).toLocaleString() : "No due date"}</p>
                    <span
                      className={`badge ${getTimeRemaining(a.dueDate) === "Overdue" ? "bg-danger" : "bg-warning text-dark"}`}
                    >
                      {getTimeRemaining(a.dueDate)}
                    </span>
                    <p className="mt-2">{a.description}</p>
                    {a.resources && a.resources.length > 0 && (
                      <ul>
                        {a.resources.map((r, i) => (
                          <li key={i}>
                            <a href={`/${r}`} download>{r}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Submit Assignment Form */}
      {view === "submit" && currentAssignment ? (
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <h4 className="mb-3 text-success">✍️ Submit: {currentAssignment.title}</h4>
          <div className="mb-3">
            <label className="form-label">Your Name</label>
            <input type="text" name="student" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description / Notes</label>
            <textarea name="description" className="form-control" rows="3"></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Files</label>
            <input type="file" name="files" className="form-control" multiple />
          </div>
          <button type="submit" className="btn btn-success">
            Submit Assignment
          </button>
        </form>
      ) : view === "submit" && !currentAssignment ? (
        <p className="text-muted">Please select an assignment to submit.</p>
      ) : null}

      {/* Submissions Page */}
      {view === "submissions" && (
        <div>
          <h4 className="text-info mb-3">📑 My Submissions</h4>
          {submissions.length === 0 ? (
            <p className="text-muted">No submissions yet.</p>
          ) : (
            <div className="list-group">
              {submissions.map((s) => (
                <div key={s.id} className="list-group-item">
                  <h6>{s.title}</h6>
                  <p className="mb-1">
                    Subject: {s.subject} | Teacher: {s.teacher}
                  </p>
                  <p className="small text-muted">
                    Submitted: {new Date(s.submittedAt).toLocaleString()}
                  </p>
                  {s.files.length > 0 && (
                    <ul className="small">
                      {s.files.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
