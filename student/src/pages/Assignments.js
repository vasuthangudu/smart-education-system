import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TEACHER_API = "http://localhost:5003/api/assignments";   // Teacher assignments
const SUBMISSIONS_API = "http://localhost:5003/api/submissions"; // Student submissions

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [view, setView] = useState("list"); // list | submit | submissions

  // === Fetch assignments and submissions ===
  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(TEACHER_API);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch assignments");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(SUBMISSIONS_API);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch submissions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAssignment) {
      toast.warning("Select an assignment first!");
      return;
    }

    const form = e.target;
    const formData = new FormData();
    formData.append("assignmentId", currentAssignment._id);
    formData.append("title", currentAssignment.title);
    formData.append("subject", currentAssignment.subject);
    formData.append("teacher", currentAssignment.teacher);
    formData.append("student", form.student.value);
    formData.append("description", form.description.value);

    if (form.files.files.length > 0) {
      Array.from(form.files.files).forEach((file) => formData.append("files", file));
    }

    try {
      const res = await axios.post(SUBMISSIONS_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmissions([res.data, ...submissions]);
      toast.success("Assignment submitted successfully!");
      form.reset();
      setView("submissions");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit assignment");
    }
  };

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

      {/* Navigation */}
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
        <div className="row">
          {assignments.length === 0 ? (
            <p className="text-muted">No assignments available.</p>
          ) : (
            assignments.map((a) => (
              <div className="col-md-6 mb-3" key={a._id}>
                <div
                  className={`card shadow-sm ${
                    currentAssignment && currentAssignment._id === a._id ? "border-primary" : ""
                  }`}
                  onClick={() => setCurrentAssignment(a)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5>{a.title}</h5>
                    <p className="text-muted mb-1">
                      Subject: {a.subject} | Teacher: {a.teacher}
                    </p>
                    {a.dueDate && (
                      <>
                        <p className="mb-1">Due: {new Date(a.dueDate).toLocaleString()}</p>
                        <span
                          className={`badge ${
                            getTimeRemaining(a.dueDate) === "Overdue"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {getTimeRemaining(a.dueDate)}
                        </span>
                      </>
                    )}
                    <p className="mt-2">{a.description}</p>
                    {a.resources && a.resources.length > 0 && (
                      <ul>
                        {a.resources.map((r, i) => (
                          <li key={i}>
                            <a href={`http://localhost:5003/uploads/${r}`} download>
                              {r}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Submit Assignment */}
      {view === "submit" && currentAssignment && (
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
          <button type="submit" className="btn btn-success">Submit</button>
        </form>
      )}
      {view === "submit" && !currentAssignment && (
        <p className="text-muted">Select an assignment to submit.</p>
      )}

      {/* My Submissions */}
      {view === "submissions" && (
        <div>
          <h4 className="text-info mb-3">📑 My Submissions</h4>
          {submissions.length === 0 ? (
            <p className="text-muted">No submissions yet.</p>
          ) : (
            <div className="list-group">
              {submissions.map((s) => (
                <div key={s._id} className="list-group-item">
                  <h6>{s.title}</h6>
                  <p className="mb-1">
                    Subject: {s.subject} | Teacher: {s.teacher}
                  </p>
                  <p className="small text-muted">
                    Submitted: {s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "N/A"}
                  </p>
                  {s.files && s.files.length > 0 && (
                    <ul className="small">
                      {s.files.map((f, i) => (
                        <li key={i}>
                          <a
                            href={`http://localhost:5003/uploads/${f}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {f}
                          </a>
                        </li>
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
