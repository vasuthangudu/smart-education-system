// src/Communication.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_MESSAGES = "http://localhost:5005/api/messages";
const API_EVENTS = "http://localhost:5004/api/events";
const API_ANNOUNCEMENTS = "http://127.0.0.1:5004/api/announcements";

// -------------------- Contact Form --------------------
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
      formData.append("sender", "student123"); // hardcoded sender
      formData.append("receiver", receiver);
      formData.append("subject", subject);
      formData.append("message", message);
      attachments.forEach((file) => formData.append("attachments", file));

      const res = await axios.post(API_MESSAGES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        onSend(res.data.data);
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      alert("Failed to send message.");
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
            <option value="Mr. Smith (Teacher)">Mr. Smith (Teacher)</option>
            <option value="Mrs. Johnson (Teacher)">Mrs. Johnson (Teacher)</option>
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
          <input type="file" multiple className="form-control" onChange={handleFileChange} />
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Send Message
        </button>
      </form>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function Communication() {
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetchMessages();
    fetchEvents();
    fetchAnnouncements();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_MESSAGES);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_EVENTS);
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch events:", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(API_ANNOUNCEMENTS);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch announcements:", err);
    }
  };

  // ----- Message Actions -----
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${API_MESSAGES}/${id}`);
      setMessages(messages.filter((m) => m._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete message:", err);
      alert("Failed to delete message.");
    }
  };

  const handleEdit = async (msg) => {
    const newSubject = prompt("Edit Subject:", msg.subject);
    const newMessage = prompt("Edit Message:", msg.message);
    if (!newSubject || !newMessage) return;

    try {
      const res = await axios.put(`${API_MESSAGES}/${msg._id}`, {
        subject: newSubject,
        message: newMessage,
      });
      setMessages(messages.map((m) => (m._id === msg._id ? res.data : m)));
    } catch (err) {
      console.error("❌ Failed to edit message:", err);
      alert("Failed to edit message.");
    }
  };

  // ----- Filtering -----
  const filtered = useMemo(() => {
    let list = [...messages];

    // 🚫 Remove student's own sent messages from Inbox
    list = list.filter((m) => m.sender !== "student123");

    if (query) {
      list = list.filter(
        (m) =>
          m.subject?.toLowerCase().includes(query.toLowerCase()) ||
          m.message?.toLowerCase().includes(query.toLowerCase())
      );
    }
    return list;
  }, [messages, query]);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read && m.sender !== "student123").length,
    [messages]
  );

  const handleSendMessage = (newMsg) => {
    setMessages([newMsg, ...messages]);
    alert("Message sent successfully!");
    setShowContactForm(false);
  };

  if (showContactForm) {
    return <ContactForm onSend={handleSendMessage} onBack={() => setShowContactForm(false)} />;
  }

  return (
    <div className="container my-4">
      {/* Inbox Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>💬 Inbox</h3>
        <div>
          <span className="badge bg-primary me-2">Unread: {unreadCount}</span>
          <button className="btn btn-sm btn-success" onClick={() => setShowContactForm(true)}>
            Contact Admin / Teacher
          </button>
        </div>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search subject/message"
          className="form-control form-control-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ minWidth: 250 }}
        />
      </div>

      <div className="row">
        <div className="col-lg-8">
          {filtered.length === 0 && <div className="alert alert-info">No messages found.</div>}
          {filtered.map((m) => (
            <div key={m._id} className={`card mb-2 ${!m.read ? "border-primary" : ""}`}>
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h6 style={{ fontWeight: !m.read ? 700 : 500 }}>
                    {m.sender}: {m.subject}
                  </h6>
                  <div className="small text-muted">{new Date(m.createdAt).toLocaleString()}</div>
                  <div>{m.message?.length > 100 ? m.message.slice(0, 100) + "…" : m.message}</div>
                </div>
                <div className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setDetail(m)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(m)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar: Announcements + Events */}
        <div className="col-lg-4">
          <div className="card p-3 mb-3">
            <h6>📢 Announcements</h6>
            <ul className="list-unstyled">
              {announcements.length === 0 && <div className="small text-muted">No announcements</div>}
              {announcements.map((a) => (
                <li key={a._id} className="mb-2">
                  <strong>{a.message}</strong>
                  <div className="small text-muted">
                    {a.date} • {a.audience}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-3">
            <h6>📅 Events</h6>
            <ul className="list-unstyled">
              {events.length === 0 && <div className="small text-muted">No events</div>}
              {events.map((e) => (
                <li key={e._id} className="mb-2">
                  <strong>{e.message}</strong>
                  <div className="small text-muted">
                    {e.date} • {e.audience}
                  </div>
                </li>
              ))}
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
                  {detail.sender} • {new Date(detail.createdAt).toLocaleString()}
                </small>
                <button className="btn-close" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body">
                <p>{detail.message}</p>
                {detail.attachments?.length > 0 && (
                  <div>
                    <h6>Attachments:</h6>
                    <ul>
                      {detail.attachments.map((a, i) => (
                        <li key={i}>
                          <a href={`http://localhost:5007${a.url}`} target="_blank" rel="noreferrer">
                            {a.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
