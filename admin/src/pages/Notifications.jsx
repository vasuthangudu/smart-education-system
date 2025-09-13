import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API = "http://localhost:5004/api"; // announcements + events
const MSG_API = "http://localhost:5005/api/messages"; // messages

export default function AdminNotifications() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("announcements");

  const [newItem, setNewItem] = useState({
    message: "",
    date: "",
    audience: "Students",
  });

  const [editId, setEditId] = useState(null);

  // Fetch data from server
  useEffect(() => {
    fetchAnnouncements();
    fetchEvents();
    fetchMessages();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API}/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(MSG_API);
      // filter only Admin messages
      const adminMsgs = res.data.filter((m) => m.receiver === "Admin");
      setMessages(adminMsgs);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  // Add or Update Item (only for Announcements & Events)
  const handleAddOrUpdate = async () => {
    if (!newItem.message || !newItem.date) {
      return alert("Enter message and date!");
    }

    try {
      if (editId) {
        // Update
        if (activeTab === "announcements") {
          await axios.put(`${API}/announcements/${editId}`, newItem);
          fetchAnnouncements();
        } else if (activeTab === "events") {
          await axios.put(`${API}/events/${editId}`, newItem);
          fetchEvents();
        }
        alert("✅ Updated successfully!");
      } else {
        // Add new
        if (activeTab === "announcements") {
          const res = await axios.post(`${API}/announcements`, newItem);
          setAnnouncements([...announcements, res.data]);
        } else if (activeTab === "events") {
          const res = await axios.post(`${API}/events`, newItem);
          setEvents([...events, res.data]);
        }
        alert("✅ Added successfully!");
      }
    } catch (err) {
      alert("❌ Error: " + err.message);
    }

    setNewItem({ message: "", date: "", audience: "Students" });
    setEditId(null);
  };

  // Delete Item (only for Announcements & Events)
  const handleDeleteItem = async (id) => {
    try {
      if (activeTab === "announcements") {
        await axios.delete(`${API}/announcements/${id}`);
        setAnnouncements(announcements.filter((n) => n._id !== id));
      } else if (activeTab === "events") {
        await axios.delete(`${API}/events/${id}`);
        setEvents(events.filter((n) => n._id !== id));
      }
      alert("🗑️ Deleted successfully!");
    } catch (err) {
      alert("❌ Error deleting: " + err.message);
    }
  };

  // Start Editing
  const handleEditItem = (item) => {
    setNewItem({
      message: item.message,
      date: item.date,
      audience: item.audience,
    });
    setEditId(item._id);
  };

  // Render Announcement/Event list
  const renderList = (list) =>
    list.length === 0 ? (
      <li className="list-group-item text-muted">No items yet</li>
    ) : (
      list.map((n) => (
        <li
          key={n._id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{n.message}</strong>
            <div className="text-muted small">
              📅 {n.date} | 🎯 {n.audience}
            </div>
          </div>
          <div>
            <button
              className="btn btn-sm btn-warning me-2"
              onClick={() => handleEditItem(n)}
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDeleteItem(n._id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </li>
      ))
    );

  // Render Admin Messages
  const renderMessages = () =>
    messages.length === 0 ? (
      <li className="list-group-item text-muted">No messages for Admin</li>
    ) : (
      messages.map((m) => (
        <li key={m._id} className="list-group-item">
          <div>
            <strong>{m.subject}</strong>
            <div className="text-muted small">
              From: {m.sender} | {new Date(m.dateTime).toLocaleString()}
            </div>
            <p className="mb-1">{m.message}</p>
            {m.attachments && m.attachments.length > 0 && (
              <ul className="list-unstyled mb-0">
                {m.attachments.map((a) => (
                  <li key={a._id}>
                    <a href={a.url} target="_blank" rel="noreferrer">
                      📎 {a.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              className={`nav-link ${
                activeTab === "announcements" ? "active" : ""
              }`}
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
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              Messages for Admin
            </button>
          </li>
        </ul>

        <div className="row">
          {/* List */}
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                {activeTab === "announcements"
                  ? "Recent Announcements"
                  : activeTab === "events"
                  ? "Upcoming Events"
                  : "Messages for Admin"}
              </div>
              <ul className="list-group list-group-flush">
                {activeTab === "announcements"
                  ? renderList(announcements)
                  : activeTab === "events"
                  ? renderList(events)
                  : renderMessages()}
              </ul>
            </div>
          </div>

          {/* Add / Edit Form only for Announcements & Events */}
          {activeTab !== "messages" && (
            <div className="col-md-6">
              <div className="card p-3 mb-4">
                <h5 className="text-success mb-3">
                  <i className="bi bi-plus-circle me-2"></i>
                  {editId
                    ? `Edit ${
                        activeTab === "announcements" ? "Announcement" : "Event"
                      }`
                    : `Add ${
                        activeTab === "announcements" ? "Announcement" : "Event"
                      }`}
                </h5>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter message"
                  value={newItem.message}
                  onChange={(e) =>
                    setNewItem({ ...newItem, message: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newItem.date}
                  onChange={(e) =>
                    setNewItem({ ...newItem, date: e.target.value })
                  }
                />
                <select
                  className="form-control mb-3"
                  value={newItem.audience}
                  onChange={(e) =>
                    setNewItem({ ...newItem, audience: e.target.value })
                  }
                >
                  <option value="All">All</option>
                  <option value="Students">Students</option>
                  <option value="Teachers">Teachers</option>
                </select>
                <button
                  className="btn btn-success w-100"
                  onClick={handleAddOrUpdate}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() => {
                      setEditId(null);
                      setNewItem({
                        message: "",
                        date: "",
                        audience: "Students",
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
