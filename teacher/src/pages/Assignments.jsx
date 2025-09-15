import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5003/api/submissions";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [view, setView] = useState("list"); // list | add
  const [role, setRole] = useState("student"); // student | teacher
  const [currentStudent] = useState("John Doe"); // simulate logged-in student
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalAssignment, setModalAssignment] = useState({ 
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    maxMarks: 0,
    files: [],
  });

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to fetch assignments!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!modalAssignment.title || !modalAssignment.subject) {
      showAlert("danger", "Please fill all required fields!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", modalAssignment.title);
      formData.append("subject", modalAssignment.subject);
      formData.append("description", modalAssignment.description);
      formData.append("teacher", modalAssignment.teacher || "Teacher");
      formData.append("dueDate", modalAssignment.dueDate);
      formData.append("maxMarks", modalAssignment.maxMarks);

      if (modalAssignment.files.length > 0) {
        Array.from(modalAssignment.files).forEach((file) =>
          formData.append("files", file)
        );
      }

      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showAlert("success", "Assignment submitted successfully!");
      setModalAssignment({
        title: "",
        subject: "",
        description: "",
        dueDate: "",
        maxMarks: 0,
        files: [],
      });
      setView("list");
      fetchAssignments();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to submit assignment!");
    }
  };

  const handleFileChange = (e) => {
    setModalAssignment({ ...modalAssignment, files: e.target.files });
  };

  const renderSubmissions = (subs) => {
    if (!subs || subs.length === 0)
      return <span className="text-muted">No submissions</span>;

    return (
      <ul className="list-unstyled mb-0">
        {subs.map((s, idx) => (
          <li
            key={idx}
            className={
              role === "student" && s.studentName === currentStudent
                ? "fw-bold text-primary"
                : ""
            }
          >
            <i className="bi bi-person-fill me-1"></i>
            {s.studentName} – {s.fileName}{" "}
            <span
              className={`badge ms-1 ${
                s.marksAwarded ? "bg-success" : "bg-warning text-dark"
              }`}
            >
              {s.marksAwarded ?? "Pending"}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📘 Assignments</h2>
        <div>
          <label className="fw-semibold me-2">Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select d-inline-block w-auto"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
      </div>

      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
        >
          {alert.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

      {view === "list" && (
        <>
          {role === "teacher" && (
            <button
              className="btn btn-success mb-3"
              onClick={() => setView("add")}
            >
              ➕ Add Assignment
            </button>
          )}

          {loading ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p className="text-muted">No assignments found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Due Date</th>
                    <th>Description</th>
                    <th>
                      {role === "teacher"
                        ? "Student Submissions"
                        : "Your Submission"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const submissions =
                      role === "student"
                        ? a.submissions?.filter(
                            (s) => s.studentName === currentStudent
                          )
                        : a.submissions;

                    return (
                      <tr key={a._id}>
                        <td className="fw-semibold">{a.title}</td>
                        <td>{a.subject}</td>
                        <td>{a.teacher || "N/A"}</td>
                        <td>
                          {a.dueDate
                            ? new Date(a.dueDate).toLocaleString()
                            : "—"}
                        </td>
                        <td>{a.description}</td>
                        <td>
                          {a.files && a.files.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {a.files.map((file, i) => (
                                <li key={i}>
                                  <a
                                    href={`http://localhost:5003/uploads/${file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {file}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {view === "add" && role === "teacher" && (
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3 text-success">➕ Add New Assignment</h4>
          <form onSubmit={handleSaveAssignment}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={modalAssignment.title}
                onChange={(e) =>
                  setModalAssignment({ ...modalAssignment, title: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select
                className="form-select"
                value={modalAssignment.subject}
                onChange={(e) =>
                  setModalAssignment({
                    ...modalAssignment,
                    subject: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={modalAssignment.description}
                onChange={(e) =>
                  setModalAssignment({
                    ...modalAssignment,
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="datetime-local"
                className="form-control"
                value={modalAssignment.dueDate}
                onChange={(e) =>
                  setModalAssignment({
                    ...modalAssignment,
                    dueDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Max Marks</label>
              <input
                type="number"
                className="form-control"
                value={modalAssignment.maxMarks}
                onChange={(e) =>
                  setModalAssignment({
                    ...modalAssignment,
                    maxMarks: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Upload Files</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <button type="submit" className="btn btn-success">
              Submit Assignment
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={() => setView("list")}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
