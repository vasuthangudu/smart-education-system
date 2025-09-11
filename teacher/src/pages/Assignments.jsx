import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock data
const initialAssignments = [
  {
    id: 1,
    title: "Math Algebra Basics",
    subject: "Math",
    dueDate: "2025-09-15T23:59",
    description: "Solve algebra problems from Chapter 3.",
    resources: ["AlgebraBasics.pdf"],
    maxMarks: 20,
    submissions: [
      { student: "Alice Johnson", files: ["Algebra1.pdf"], submittedAt: "2025-09-14T10:00" },
      { student: "Bob Smith", files: [], submittedAt: null },
    ],
  },
  {
    id: 2,
    title: "Science Lab Report",
    subject: "Science",
    dueDate: "2025-09-20T18:00",
    description: "Submit your lab experiment report on acids and bases.",
    resources: [],
    maxMarks: 25,
    submissions: [
      { student: "Alice Johnson", files: ["LabReport.pdf"], submittedAt: "2025-09-19T16:00" },
      { student: "Bob Smith", files: [], submittedAt: null },
    ],
  },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [view, setView] = useState("list"); // list | add
  const [filterSubject, setFilterSubject] = useState("All");
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [modalAssignment, setModalAssignment] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
    maxMarks: 0,
    resources: [],
  });
  const [alert, setAlert] = useState(null);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    if (!modalAssignment.title || !modalAssignment.subject || !modalAssignment.dueDate) {
      showAlert("danger", "Please fill all required fields!");
      return;
    }

    if (editingAssignment) {
      setAssignments(assignments.map(a => a.id === editingAssignment.id ? { ...editingAssignment, ...modalAssignment } : a));
      showAlert("success", "Assignment updated successfully!");
    } else {
      const newAssignment = { ...modalAssignment, id: Date.now(), submissions: [] };
      setAssignments([...assignments, newAssignment]);
      showAlert("success", "Assignment added successfully!");
    }

    setModalAssignment({ title: "", subject: "", description: "", dueDate: "", maxMarks: 0, resources: [] });
    setEditingAssignment(null);
    setView("list");
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setModalAssignment({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      resources: assignment.resources,
    });
    setView("add");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a.id !== id));
      showAlert("info", "Assignment deleted.");
    }
  };

  const handleResourcesChange = (e) => {
    const resources = e.target.value.split(",").map(r => r.trim());
    setModalAssignment({ ...modalAssignment, resources });
  };

  const filteredAssignments = assignments.filter(a => filterSubject === "All" || a.subject === filterSubject);

  return (
    <div className="container my-4">
      <h2 className="text-primary mb-4">📝 Teacher Assignments</h2>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.text}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Navigation */}
      <div className="mb-4">
        <button className={`btn me-2 ${view === "list" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("list")}>
          Assignment List
        </button>
        <button className={`btn ${view === "add" ? "btn-success" : "btn-outline-success"}`} onClick={() => setView("add")}>
          {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
        </button>
      </div>

      {/* Assignment List */}
      {view === "list" && (
        <>
          <div className="mb-3 row g-2">
            <div className="col-md-3">
              <select className="form-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                <option value="All">All Subjects</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
              </select>
            </div>
          </div>

          {filteredAssignments.length === 0 ? (
            <p className="text-muted">No assignments found.</p>
          ) : (
            <div className="row">
              {filteredAssignments.map((a) => (
                <div key={a.id} className="col-md-6 mb-3">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>{a.title}</h5>
                      <p className="mb-1 text-muted">Subject: {a.subject} | Due: {new Date(a.dueDate).toLocaleString()}</p>
                      <p>{a.description}</p>
                      {a.resources.length > 0 && (
                        <ul>
                          {a.resources.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      )}
                      <p className="small text-muted">Max Marks: {a.maxMarks}</p>

                      <div className="mt-2">
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEdit(a)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}>Delete</button>
                      </div>

                      {/* Submissions */}
                      <div className="mt-3">
                        <h6>Submissions:</h6>
                        {a.submissions.length === 0 ? (
                          <p className="text-muted">No submissions yet.</p>
                        ) : (
                          <ul className="list-group list-group-flush">
                            {a.submissions.map((s, i) => (
                              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                {s.student}
                                {s.submittedAt ? (
                                  <span className="badge bg-success">Submitted</span>
                                ) : (
                                  <span className="badge bg-warning text-dark">Pending</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Assignment Page */}
      {view === "add" && (
        <div className="card p-4 shadow-sm">
          <h4 className="mb-3 text-success">{editingAssignment ? "✏️ Edit Assignment" : "➕ Add New Assignment"}</h4>
          <form onSubmit={handleSaveAssignment}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={modalAssignment.title} onChange={(e) => setModalAssignment({ ...modalAssignment, title: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <select className="form-select" value={modalAssignment.subject} onChange={(e) => setModalAssignment({ ...modalAssignment, subject: e.target.value })} required>
                <option value="">Select Subject</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input type="datetime-local" className="form-control" value={modalAssignment.dueDate} onChange={(e) => setModalAssignment({ ...modalAssignment, dueDate: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={modalAssignment.description} onChange={(e) => setModalAssignment({ ...modalAssignment, description: e.target.value })}></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Max Marks</label>
              <input type="number" className="form-control" value={modalAssignment.maxMarks} onChange={(e) => setModalAssignment({ ...modalAssignment, maxMarks: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Resources (comma separated)</label>
              <input type="text" className="form-control" value={modalAssignment.resources.join(", ")} onChange={handleResourcesChange} />
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-success">
                {editingAssignment ? "Update Assignment" : "Add Assignment"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => { setView("list"); setEditingAssignment(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
