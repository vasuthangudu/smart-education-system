import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminNotifications() {
  // Initial Data
  const [announcements, setAnnouncements] = useState([
    { id: 1, message: "New course added: AI Basics", date: "2025-09-05", audience: "Students" },
    { id: 2, message: "Holiday on Sept 12", date: "2025-09-07", audience: "Students" },
  ]);

  const [events, setEvents] = useState([
    { id: 1, message: "Exam schedule released", date: "2025-09-06", audience: "Teachers" },
  ]);

  const [activeTab, setActiveTab] = useState("announcements");

  const [newItem, setNewItem] = useState({
    message: "",
    date: "",
    audience: "Students",
  });

  // Handle Add
  const handleAddItem = () => {
    if (!newItem.message || !newItem.date) {
      return alert("Enter message and date!");
    }
    const id = (activeTab === "announcements" ? announcements.length : events.length) + 1;
    const item = { id, ...newItem };

    if (activeTab === "announcements") {
      setAnnouncements([...announcements, item]);
    } else {
      setEvents([...events, item]);
    }

    setNewItem({ message: "", date: "", audience: "Students" });
  };

  // Handle Delete
  const handleDeleteItem = (id) => {
    if (activeTab === "announcements") {
      setAnnouncements(announcements.filter((n) => n.id !== id));
    } else {
      setEvents(events.filter((n) => n.id !== id));
    }
  };

  // Render List
  const renderList = (list) =>
    list.length === 0 ? (
      <li className="list-group-item text-muted">No items yet</li>
    ) : (
      list.map((n) => (
        <li key={n.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{n.message}</strong>
            <div className="text-muted small">
              📅 {n.date} | 🎯 {n.audience}
            </div>
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteItem(n.id)}>
            <i className="bi bi-trash"></i>
          </button>
        </li>
      ))
    );

  return (
    <div className="container my-4">
      <div className="card shadow p-3">
        <h3 className="mb-4 text-primary">
          <i className="bi bi-bell-fill me-2"></i>Admin Dashboard
        </h3>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "announcements" ? "active" : ""}`}
              onClick={() => setActiveTab("announcements")}
            >
              Recent Announcements
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              Upcoming Events
            </button>
          </li>
        </ul>

        <div className="row">
          {/* List */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                {activeTab === "announcements" ? "Recent Announcements" : "Upcoming Events"}
              </div>
              <ul className="list-group list-group-flush">
                {activeTab === "announcements" ? renderList(announcements) : renderList(events)}
              </ul>
            </div>
          </div>

          {/* Add Form */}
          <div className="col-md-6">
            <div className="card p-3 mb-4">
              <h5 className="text-success mb-3">
                <i className="bi bi-plus-circle me-2"></i>
                Add {activeTab === "announcements" ? "Announcement" : "Event"}
              </h5>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter message"
                value={newItem.message}
                onChange={(e) => setNewItem({ ...newItem, message: e.target.value })}
              />
              <input
                type="date"
                className="form-control mb-2"
                value={newItem.date}
                onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
              />
              <select
                className="form-control mb-3"
                value={newItem.audience}
                onChange={(e) => setNewItem({ ...newItem, audience: e.target.value })}
              >
                <option value="Students">All</option>
                <option value="Students">Students</option>
                <option value="Teachers">Teachers</option>
              </select>
              <button className="btn btn-success w-100" onClick={handleAddItem}>
                <i className="bi bi-check-circle me-2"></i>Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
