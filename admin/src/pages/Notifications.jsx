// src/components/AdminNotifications.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AdminNotifications() {
  const [adminMessages, setAdminMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [announcements, setAnnouncements] = useState([
    { id: 1, message: "New course added: AI Basics", date: "2025-09-05", audience: "Students" },
    { id: 2, message: "Holiday on Sept 12", date: "2025-09-07", audience: "Students" },
  ]);

  const [events, setEvents] = useState([
    { id: 1, message: "Exam schedule released", date: "2025-09-06", audience: "Teachers" },
  ]);

  const [activeTab, setActiveTab] = useState("messages");

  const [newItem, setNewItem] = useState({
    message: "",
    date: "",
    audience: "Students",
  });

  // Fetch messages for Admin
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("http://localhost:5001/api/messages");
        const filtered = data.filter((msg) => msg.receiver === "Admin");
        setAdminMessages(filtered);
      } catch (err) {
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleAddItem = () => {
    if (!newItem.message || !newItem.date) {
      return alert("Enter message and date!");
    }
    const id = (activeTab === "announcements" ? announcements.length : events.length) + 1;
    const item = { id, ...newItem };
    if (activeTab === "announcements") {
      setAnnouncements([...announcements, item]);
    } else if (activeTab === "events") {
      setEvents([...events, item]);
    }
    setNewItem({ message: "", date: "", audience: "Students" });
  };

  const handleDeleteItem = (id) => {
    if (activeTab === "announcements") {
      setAnnouncements(announcements.filter((n) => n.id !== id));
    } else if (activeTab === "events") {
      setEvents(events.filter((n) => n.id !== id));
    }
  };

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
              className={`nav-link ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              Admin Messages
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "announcements" ? "active" : ""}`}
              onClick={() => setActiveTab("announcements")}
            >
              Announcements
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === "messages" && (
          <div className="card">
            <div className="card-header bg-info text-white">Messages for Admin</div>
            {loading ? (
              <div className="p-3 text-center">Loading...</div>
            ) : error ? (
              <div className="p-3 text-danger">{error}</div>
            ) : adminMessages.length === 0 ? (
              <div className="p-3 text-muted">No messages for Admin</div>
            ) : (
              <ul className="list-group list-group-flush">
                {adminMessages.map((msg) => (
                  <li key={msg._id} className="list-group-item">
                    <div className="fw-bold">{msg.subject}</div>
                    <div>{msg.message}</div>
                    {msg.attachments?.length > 0 && (
                      <div className="mt-2">
                        {msg.attachments.map((file) => (
                          <a
                            key={file._id}
                            href={`http://localhost:5001${file.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            📎 {file.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <small className="text-muted">
                      From: {msg.sender} | {new Date(msg.createdAt).toLocaleString()}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab !== "messages" && (
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-header bg-secondary text-white">
                  {activeTab === "announcements" ? "Announcements" : "Events"}
                </div>
                <ul className="list-group list-group-flush">
                  {activeTab === "announcements" ? renderList(announcements) : renderList(events)}
                </ul>
              </div>
            </div>
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
        )}
      </div>
    </div>
  );
}
