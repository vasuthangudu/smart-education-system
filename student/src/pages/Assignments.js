import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data (replace with API later)
const initialAssignments = [
  {
    id: 1,
    title: "Math Algebra Basics",
    subject: "Math",
    teacher: "Mr. Smith",
    dueDate: "2025-09-15T23:59",
    description: "Solve algebra problems from Chapter 3.",
    resources: ["AlgebraBasics.pdf"],
    maxMarks: 20,
  },
  {
    id: 2,
    title: "Science Lab Report",
    subject: "Science",
    teacher: "Dr. Adams",
    dueDate: "2025-09-20T18:00",
    description: "Submit your lab experiment report on acids and bases.",
    resources: [],
    maxMarks: 25,
  },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState([]);
  const [view, setView] = useState("list"); // "list" or "submit" or "submissions"
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterTeacher, setFilterTeacher] = useState("All");

  // Load submissions from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("submissions")) || [];
    setSubmissions(saved);
  }, []);

  // Save submissions to localStorage
  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }, [submissions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const newSubmission = {
      id: Date.now(),
      title: form.title.value,
      subject: form.subject.value,
      teacher: form.teacher.value,
      description: form.description.value,
      files: form.files.files ? Array.from(form.files.files).map(f => f.name) : [],
      submittedAt: new Date().toISOString(),
    };
    setSubmissions([...submissions, newSubmission]);
    toast.success("Assignment submitted successfully!");
    form.reset();
    setView("submissions");
  };

  const filteredAssignments = assignments.filter((a) => {
    const subjectMatch = filterSubject === "All" || a.subject === filterSubject;
    const teacherMatch = filterTeacher === "All" || a.teacher === filterTeacher;
    return subjectMatch && teacherMatch;
  });

  const getTimeRemaining = (dueDate) => {
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
          onClick={() => setView("submit")}
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
                <option value="Math">Math</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
              >
                <option value="All">All Teachers</option>
                <option value="Mr. Smith">Mr. Smith</option>
                <option value="Dr. Adams">Dr. Adams</option>
              </select>
            </div>
          </div>

          <div className="row">
            {filteredAssignments.map((a) => (
              <div className="col-md-6 mb-3" key={a.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5>{a.title}</h5>
                    <p className="text-muted mb-1">
                      Subject: {a.subject} | Teacher: {a.teacher}
                    </p>
                    <p className="mb-1">Due: {new Date(a.dueDate).toLocaleString()}</p>
                    <span
                      className={`badge ${
                        getTimeRemaining(a.dueDate) === "Overdue" ? "bg-danger" : "bg-warning text-dark"
                      }`}
                    >
                      {getTimeRemaining(a.dueDate)}
                    </span>
                    <p className="mt-2">{a.description}</p>
                    {a.resources.length > 0 && (
                      <ul>
                        {a.resources.map((r, i) => (
                          <li key={i}>
                            <a href={`/${r}`} download>
                              {r}
                            </a>
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
      {view === "submit" && (
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <h4 className="mb-3 text-success">✍️ Submit Your Assignment</h4>
          <div className="mb-3">
            <label className="form-label">Assignment Title</label>
            <input type="text" name="title" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <select name="subject" className="form-select" required>
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Teacher Name</label>
            <select name="teacher" className="form-select" required>
              <option value="">Select Teacher</option>
              <option value="Mr. Smith">Mr. Smith</option>
              <option value="Dr. Adams">Dr. Adams</option>
            </select>
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
      )}

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
