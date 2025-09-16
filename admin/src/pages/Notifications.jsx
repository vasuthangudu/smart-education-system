import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API = "http://localhost:5007/api/messages";

export default function AdminNotifications() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMsg, setNewMsg] = useState({
    sender: "Admin",
    receiver: "All",
    subject: "",
    message: "",
  });
  const [files, setFiles] = useState([]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setMessages(res.data);
      setError(null);
    } catch {
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async () => {
    if (!newMsg.message) return alert("Enter a message!");
    const formData = new FormData();
    Object.entries(newMsg).forEach(([k, v]) => formData.append(k, v));
    files.forEach((f) => formData.append("attachments", f));

    await axios.post(API, formData, { headers: { "Content-Type": "multipart/form-data" } });
    setNewMsg({ sender: "Admin", receiver: "All", subject: "", message: "" });
    setFiles([]);
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await axios.delete(`${API}/${id}`);
    fetchMessages();
  };

  return (
    <div className="container my-4">
      <div className="card shadow p-3">
        <h3 className="mb-4 text-primary">
          <i className="bi bi-bell-fill me-2"></i>Admin Communication
        </h3>

        {/* Messages List */}
        <div className="card overflow-auto mb-4" style={{ maxHeight: "400px" }}>
          <div className="card-header bg-info text-white d-flex justify-content-between">
            <span>Messages</span>
            <small className="text-light">From Admin → All/Student/Teacher</small>
          </div>
          {loading ? (
            <div className="p-3 text-center">Loading...</div>
          ) : error ? (
            <div className="p-3 text-danger">{error}</div>
          ) : messages.length === 0 ? (
            <div className="p-3 text-muted">No messages yet</div>
          ) : (
            <ul className="list-group list-group-flush">
              {messages.map((msg) => (
                <li key={msg._id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">
                      From: {msg.sender} ➤ To: {msg.receiver}
                      {msg.subject && (
                        <span className="text-muted small"> ({msg.subject})</span>
                      )}
                    </div>
                    <div>{msg.message}</div>
                    {msg.attachments?.length > 0 && (
                      <div className="mt-2">
                        {msg.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={`http://localhost:5007${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary me-1 mb-1"
                          >
                            📎 {file.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <small className="text-muted">
                      {new Date(msg.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-danger h-50 align-self-center"
                    onClick={() => handleDelete(msg._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Send Message */}
        <h5 className="text-success mb-3">
          <i className="bi bi-send-fill me-2"></i>Send New Notification
        </h5>
        <div className="row mb-2">
          <div className="col-md-4">
            <label className="form-label">To:</label>
            <select
              className="form-select"
              value={newMsg.receiver}
              onChange={(e) => setNewMsg({ ...newMsg, receiver: e.target.value })}
            >
              <option value="All">All</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label">Subject:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Subject"
              value={newMsg.subject}
              onChange={(e) => setNewMsg({ ...newMsg, subject: e.target.value })}
            />
          </div>
        </div>
        <textarea
          className="form-control mb-2"
          placeholder="Enter your message"
          value={newMsg.message}
          onChange={(e) => setNewMsg({ ...newMsg, message: e.target.value })}
        />
        <input
          type="file"
          className="form-control mb-3"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button className="btn btn-success w-100" onClick={handleSend}>
          <i className="bi bi-check-circle me-2"></i>Send
        </button>
      </div>
    </div>
  );
}
