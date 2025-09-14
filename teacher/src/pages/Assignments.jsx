import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const API_URL = "http://localhost:5005/api/assignments";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [view, setView] = useState("list");
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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(API_URL);
      setAssignments(res.data);
    } catch {
      showAlert("danger", "Failed to fetch assignments.");
    }
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!modalAssignment.title || !modalAssignment.subject || !modalAssignment.dueDate) {
      showAlert("danger", "Please fill all required fields!");
      return;
    }

    try {
      if (editingAssignment) {
        await axios.put(`${API_URL}/${editingAssignment._id}`, modalAssignment);
        showAlert("success", "Assignment updated successfully!");
      } else {
        await axios.post(API_URL, modalAssignment);
        showAlert("success", "Assignment added successfully!");
      }
      fetchAssignments();
    } catch {
      showAlert("danger", "Failed to save assignment.");
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
      dueDate: assignment.dueDate?.slice(0, 16),
      maxMarks: assignment.maxMarks,
      resources: assignment.resources,
    });
    setView("add");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchAssignments();
        showAlert("info", "Assignment deleted.");
      } catch {
        showAlert("danger", "Failed to delete assignment.");
      }
    }
  };

  const handleResourcesChange = (e) => {
    const resources = e.target.value.split(",").map((r) => r.trim());
    setModalAssignment({ ...modalAssignment, resources });
  };

  const filteredAssignments = assignments.filter(
    (a) => filterSubject === "All" || a.subject === filterSubject
  );

  return (
    <div className="container my-4">
      <h2 className="text-primary mb-4">📝 Teacher Assignments</h2>

      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.text}
        </div>
      )}

      <div className="mb-4">
        <button
          className={`btn me-2 ${view === "list" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setView("list")}
        >
          Assignment List
        </button>
        <button
          className={`btn ${view === "add" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setView("add")}
        >
          {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
        </button>
      </div>

      {view === "list" && (
        <>
          <div className="mb-3">
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

          {filteredAssignments.length === 0 ? (
            <p>No assignments found.</p>
          ) : (
            <div className="row">
              {filteredAssignments.map((a) => (
                <div key={a._id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5>{a.title}</h5>
                      <p>{a.subject} | Due: {new Date(a.dueDate).toLocaleString()}</p>
                      <p>{a.description}</p>
                      <p>Max Marks: {a.maxMarks}</p>
                      <div>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(a)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "add" && (
        <form onSubmit={handleSaveAssignment}>
          <input
            type="text"
            placeholder="Title"
            value={modalAssignment.title}
            onChange={(e) => setModalAssignment({ ...modalAssignment, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={modalAssignment.subject}
            onChange={(e) => setModalAssignment({ ...modalAssignment, subject: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            value={modalAssignment.dueDate}
            onChange={(e) => setModalAssignment({ ...modalAssignment, dueDate: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={modalAssignment.description}
            onChange={(e) => setModalAssignment({ ...modalAssignment, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Marks"
            value={modalAssignment.maxMarks}
            onChange={(e) => setModalAssignment({ ...modalAssignment, maxMarks: e.target.value })}
          />
          <input
            type="text"
            placeholder="Resources (comma separated)"
            value={modalAssignment.resources.join(", ")}
            onChange={handleResourcesChange}
          />
          <button type="submit">{editingAssignment ? "Update" : "Add"} Assignment</button>
        </form>
      )}
    </div>
  );
}
