// Assignments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:7002/api/submissions";
const UPLOADS_BASE = "http://localhost:7002/uploads";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [view, setView] = useState("list"); // list | add | edit
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterSubject, setFilterSubject] = useState("All");
  const [modalAssignment, setModalAssignment] = useState({
    _id: null,
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    maxMarks: 0,
    teacher: "",
    files: [],
  });

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3500);
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
    if (modalAssignment.maxMarks < 0) {
      showAlert("danger", "Max Marks cannot be negative!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", modalAssignment.title);
      formData.append("subject", modalAssignment.subject);
      formData.append("description", modalAssignment.description || "");
      formData.append("teacher", modalAssignment.teacher || "Teacher");
      if (modalAssignment.dueDate) formData.append("dueDate", modalAssignment.dueDate);
      formData.append("maxMarks", modalAssignment.maxMarks ?? 0);

      if (modalAssignment.files && modalAssignment.files.length > 0) {
        Array.from(modalAssignment.files).forEach((file) =>
          formData.append("files", file)
        );
      }

      if (modalAssignment._id) {
        // Edit existing
        await axios.put(`${API_URL}/${modalAssignment._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("success", "Assignment updated successfully!");
      } else {
        // New
        await axios.post(API_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showAlert("success", "Assignment submitted successfully!");
      }

      resetForm();
      setView("list");
      fetchAssignments();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to save assignment!");
    }
  };

  const handleEdit = (assignment) => {
    setModalAssignment({
      _id: assignment._id,
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 16) : "",
      maxMarks: assignment.maxMarks,
      teacher: assignment.teacher,
      files: [],
    });
    setView("edit");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlert("success", "Assignment deleted successfully!");
      fetchAssignments();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to delete assignment!");
    }
  };

  const handleFileChange = (e) => {
    setModalAssignment({ ...modalAssignment, files: e.target.files });
  };

  const resetForm = () => {
    setModalAssignment({
      _id: null,
      title: "",
      subject: "",
      description: "",
      dueDate: "",
      maxMarks: 0,
      teacher: "",
      files: [],
    });
  };

  const filteredAssignments = assignments.filter(
    (a) => filterSubject === "All" || a.subject === filterSubject
  );

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">📘 Assignments</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            resetForm();
            setView("add");
          }}
        >
          ➕ Add Assignment
        </button>
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
          <div className="mb-3">
            <label className="me-2 fw-semibold">Filter by Subject:</label>
            <select
              className="form-select w-auto d-inline-block"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {loading ? (
            <p>Loading assignments...</p>
          ) : filteredAssignments.length === 0 ? (
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
                    <th>Files</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((a) => (
                    <tr key={a._id}>
                      <td className="fw-semibold">{a.title}</td>
                      <td>{a.subject}</td>
                      <td>{a.teacher || "N/A"}</td>
                      <td>
                        {a.dueDate
                          ? new Date(a.dueDate).toLocaleString()
                          : "—"}
                      </td>
                      <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>
                        {a.description}
                      </td>
                      <td>
                        {a.files && a.files.length > 0 ? (
                          <ul className="list-unstyled mb-0">
                            {a.files.map((file, i) => (
                              <li key={i}>
                                <a
                                  href={`${UPLOADS_BASE}/${file}`}
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
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(a)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(a._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {(view === "add" || view === "edit") && (
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3 text-success">
            {view === "edit" ? "✏ Edit Assignment" : "➕ Add New Assignment"}
          </h4>
          <form onSubmit={handleSaveAssignment}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={modalAssignment.title}
                onChange={(e) =>
                  setModalAssignment({
                    ...modalAssignment,
                    title: e.target.value,
                  })
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
              <label className="form-label">Teacher</label>
              <input
                type="text"
                className="form-control"
                value={modalAssignment.teacher}
                onChange={(e) =>
                  setModalAssignment({
                    ...modalAssignment,
                    teacher: e.target.value,
                  })
                }
                placeholder="Teacher name"
              />
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
                    maxMarks: Number(e.target.value),
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
              {view === "edit" ? "Update Assignment" : "Submit Assignment"}
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
