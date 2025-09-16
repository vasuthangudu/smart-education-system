import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

<<<<<<< HEAD
export default function Assignments() {
  const [assignments, setAssignments] = useState([]);        // Teacher assignments
  const [submissions, setSubmissions] = useState([]);        // Student submissions
  const [view, setView] = useState("list");                  // list | submit | submissions | teacher
=======
const API_URL = "http://localhost:5007/api/assignments";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [view, setView] = useState("list"); // "list", "submit", "submissions"
>>>>>>> b9e9910604202d8464670d98ae7e9c7d2b0a12aa
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterTeacher, setFilterTeacher] = useState("All");
  const [currentAssignment, setCurrentAssignment] = useState(null);

<<<<<<< HEAD
  const SUBMISSIONS_API = "http://localhost:5003/api/submissions";
  const TEACHER_API = "http://localhost:5003/api/assignments";

  // Fetch teacher assignments and student submissions
=======
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
>>>>>>> b9e9910604202d8464670d98ae7e9c7d2b0a12aa
  useEffect(() => {
    fetchTeacherAssignments();
    fetchSubmissions();
  }, []);

  const fetchTeacherAssignments = async () => {
    try {
      const res = await axios.get(TEACHER_API);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch teacher assignments");
    }
  };

<<<<<<< HEAD
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(SUBMISSIONS_API);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch submissions");
    }
  };

=======
>>>>>>> b9e9910604202d8464670d98ae7e9c7d2b0a12aa
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAssignment) {
      toast.warning("Please select an assignment first!");
      return;
    }
    const form = e.target;
<<<<<<< HEAD
    const formData = new FormData();
    formData.append("title", form.title.value);
    formData.append("subject", form.subject.value);
    formData.append("teacher", form.teacher.value);
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
=======
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
>>>>>>> b9e9910604202d8464670d98ae7e9c7d2b0a12aa
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
      <h2 className="text-primary mb-4">📋 Assignments Portal</h2>

      {/* Navigation Buttons */}
      <div className="mb-4">
        <button
          className={`btn me-2 ${view === "list" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("list")}
        >
          View Teacher Assignments
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
          className={`btn me-2 ${view === "submissions" ? "btn-info" : "btn-outline-info"}`}
          onClick={() => setView("submissions")}
        >
          My Submissions
        </button>
        <button
          className={`btn ${view === "teacher" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setView("teacher")}
        >
          Teacher Submissions Data
        </button>
      </div>

      {/* Teacher Assignments */}
      {view === "list" && (
        <>
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
<<<<<<< HEAD
            {filteredAssignments.length === 0 ? (
              <p className="text-muted">No teacher assignments found.</p>
            ) : (
              filteredAssignments.map((a) => (
                <div className="col-md-6 mb-3" key={a._id || a.id}>
                  <div className="card shadow-sm">
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
=======
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
>>>>>>> b9e9910604202d8464670d98ae7e9c7d2b0a12aa
                  </div>
                </div>
              ))
            )}
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
                    Submitted: {new Date(s.submittedAt).toLocaleString()}
                  </p>
                  {s.files.length > 0 && (
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

      {/* Teacher Submissions Data */}
      {view === "teacher" && (
        <div>
          <h4 className="text-warning mb-3">👩‍🏫 Teacher Submission Data</h4>
          {assignments.length === 0 ? (
            <p className="text-muted">No teacher submissions available.</p>
          ) : (
            assignments.map((a) => (
              <div key={a._id} className="list-group-item mb-2">
                <h6>{a.title}</h6>
                <p className="mb-1">
                  Subject: {a.subject} | Teacher: {a.teacher}
                </p>
                {a.files && a.files.length > 0 && (
                  <ul>
                    {a.files.map((f, i) => (
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
            ))
          )}
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}
