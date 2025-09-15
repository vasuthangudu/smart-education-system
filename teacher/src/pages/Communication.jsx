// Communication.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:5005/api/messages";

// Contact Form Component
function ContactForm({ onSend, onBack }) {
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => setAttachments([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiver || !subject || !message) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sender", "student123"); // Change as needed
      formData.append("receiver", receiver);
      formData.append("subject", subject);
      formData.append("message", message);
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await axios.post(API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSend(res.data);
      setReceiver("");
      setSubject("");
      setMessage("");
      setAttachments([]);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>📩 Contact Admin / Teacher</h5>
        <button className="btn btn-sm btn-secondary" onClick={onBack}>
          Back to Inbox
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Send To</label>
          <select
            className="form-select"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">Subject</label>
          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="form-label">Attachments (optional)</label>
          <input
            type="file"
            multiple
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Send Message
        </button>
      </form>
    </div>
  );
}

// Main Communication Component
export default function Communication() {
  const [messages, setMessages] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [query, setQuery] = useState("");
  const [senderFilter, setSenderFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [detail, setDetail] = useState(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await axios.get(API);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id) => {
    const msg = messages.find((m) => m._id === id);
    if (!msg) return;
    try {
      await axios.patch(`${API}/${id}`, { read: !msg.read });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: !m.read } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const togglePin = async (id) => {
    const msg = messages.find((m) => m._id === id);
    if (!msg) return;
    try {
      await axios.patch(`${API}/${id}`, { pinned: !msg.pinned });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, pinned: !m.pinned } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(() => {
    let list = [...messages];
    if (query)
      list = list.filter(
        (m) =>
          m.subject.toLowerCase().includes(query.toLowerCase()) ||
          m.message.toLowerCase().includes(query.toLowerCase())
      );
    if (senderFilter !== "All") list = list.filter((m) => m.sender.includes(senderFilter));
    if (categoryFilter !== "All") list = list.filter((m) => m.category === categoryFilter);
    if (sortBy === "newest") list.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    if (sortBy === "priority")
      list.sort((a, b) => (a.priority === "Urgent" ? -1 : 1));
    return list;
  }, [messages, query, senderFilter, categoryFilter, sortBy]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const handleSendMessage = (newMsg) => {
    setMessages([newMsg, ...messages]);
    setShowContactForm(false);
  };

  if (showContactForm) {
    return <ContactForm onSend={handleSendMessage} onBack={() => setShowContactForm(false)} />;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>💬 Inbox</h3>
        <div>
          <span className="badge bg-primary me-2">Unread: {unreadCount}</span>
          <button className="btn btn-sm btn-success" onClick={() => setShowContactForm(true)}>
            Contact Admin / Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search subject/message"
          className="form-control form-control-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 250 }}
        />
        <select
          className="form-select form-select-sm"
          value={senderFilter}
          onChange={(e) => setSenderFilter(e.target.value)}
        >
          <option>All</option>
          <option>Admin</option>
          <option>Student</option>
        </select>
        <select
          className="form-select form-select-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          <option>Announcement</option>
          <option>Assignment</option>
          <option>Exam</option>
          <option>Event</option>
          <option>Query</option>
        </select>
        <select
          className="form-select form-select-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="row">
        {/* Messages List */}
        <div className="col-lg-8">
          {filtered.length === 0 && <div className="alert alert-info">No messages found.</div>}
          {filtered.map((m) => (
            <div key={m._id} className={`card mb-2 ${!m.read ? "border-primary" : ""}`}>
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h6 style={{ fontWeight: !m.read ? 700 : 500 }}>
                    {m.sender}: {m.subject}{" "}
                    {m.priority && <span className="badge bg-warning ms-2">{m.priority}</span>}
                  </h6>
                  <div className="small text-muted">{new Date(m.dateTime).toLocaleString()}</div>
                  <div>{m.message.length > 100 ? m.message.slice(0, 100) + "…" : m.message}</div>
                </div>
                <div className="text-end">
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => toggleRead(m._id)}>
                    {!m.read ? "Mark Read" : "Mark Unread"}
                  </button>
                  <button
                    className={`btn btn-sm ${m.pinned ? "btn-success" : "btn-outline-success"} me-1`}
                    onClick={() => togglePin(m._id)}
                  >
                    {m.pinned ? "Pinned" : "Pin"}
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setDetail(m)}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Pinned Messages */}
        <div className="col-lg-4">
          <div className="card p-3 mb-3">
            <h6>Pinned Messages</h6>
            <ul className="list-unstyled">
              {messages.filter((m) => m.pinned).map((m) => (
                <li key={m._id} className="mb-2">
                  <strong>{m.subject}</strong>
                  <div className="small text-muted">{new Date(m.dateTime).toLocaleString()}</div>
                </li>
              ))}
              {messages.filter((m) => m.pinned).length === 0 && (
                <div className="small text-muted">No pinned messages</div>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {detail && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{detail.subject}</h5>
                <small className="text-muted ms-3">
                  {detail.sender} • {new Date(detail.dateTime).toLocaleString()}
                </small>
                <button className="btn-close" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body">
                <p>{detail.message}</p>
                {detail.attachments.length > 0 && (
                  <div>
                    <h6>Attachments:</h6>
                    <ul>
                      {detail.attachments.map((a, i) => (
                        <li key={i}>
                          <a href={`http://localhost:5005${a.url}`} target="_blank" rel="noreferrer">
                            {a.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <h6>Replies:</h6>
                <ul>
                  {detail.replies.map((r) => (
                    <li key={r._id || r.id}>
                      <strong>{r.sender}</strong>: {r.message}{" "}
                      <span className="small text-muted">({new Date(r.dateTime).toLocaleString()})</span>
                    </li>
                  ))}
                  {detail.replies.length === 0 && <li className="small text-muted">No replies yet.</li>}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetail(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
