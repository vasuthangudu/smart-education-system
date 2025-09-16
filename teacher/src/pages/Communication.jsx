// Communication.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://localhost:5005/api/messages";
const ANNOUNCE_URL = "http://127.0.0.1:5004/api/announcements";
const EVENTS_URL = "http://localhost:5004/api/events";

function ContactForm({ onSend, onBack, editingMsg, onUpdate }) {
  const [sender, setSender] = useState("Teacher");
  const [receiver, setReceiver] = useState("Admin");
  const [subject, setSubject] = useState(editingMsg?.subject || "");
  const [message, setMessage] = useState(editingMsg?.message || "");
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => setAttachments(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiver || !subject || !message) return alert("Please fill all fields");

    const msgData = {
      sender,
      receiver,
      subject,
      message,
      attachments: attachments.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
      priority: "Normal",
      category: "Query",
    };

    try {
      if (editingMsg) {
        const res = await axios.put(`${API_URL}/${editingMsg._id}`, msgData);
        onUpdate(res.data);
      } else {
        const res = await axios.post(API_URL, msgData);
        onSend(res.data);
      }
      setReceiver("");
      setSubject("");
      setMessage("");
      setAttachments([]);
    } catch (err) {
      alert("Failed: " + err.message);
    }
  };

  return (
    <div className="card p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>{editingMsg ? "✏️ Edit Message" : "📩 Contact"}</h5>
        <button className="btn btn-sm btn-secondary" onClick={onBack}>Back</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Sender</label>
          <select className="form-select" value={sender} onChange={(e) => setSender(e.target.value)}>
            <option value="Teacher">Teacher</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">Send To</label>
          <select className="form-select" value={receiver} onChange={(e) => setReceiver(e.target.value)} required>
            <option value="">Select</option>
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">Subject</label>
          <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Message</label>
          <textarea className="form-control" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Attachments (optional)</label>
          <input type="file" multiple className="form-control" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-primary mt-2">{editingMsg ? "Update" : "Send"}</button>
      </form>
    </div>
  );
}

export default function Communication() {
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMsg, setEditingMsg] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchMessages();
    fetchAnnouncements();
    fetchEvents();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_URL);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Fetch messages failed", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(ANNOUNCE_URL);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("❌ Fetch announcements failed", err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(EVENTS_URL);
      setEvents(res.data);
    } catch (err) {
      console.error("❌ Fetch events failed", err);
    }
  };

  const toggleRead = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/read`);
      setMessages((msgs) => msgs.map((m) => (m._id === id ? res.data : m)));
    } catch {}
  };

  const togglePin = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}/pin`);
      setMessages((msgs) => msgs.map((m) => (m._id === id ? res.data : m)));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      if (res.data.success) setMessages((msgs) => msgs.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
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
    if (sortBy === "newest") list.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    return list;
  }, [messages, query, sortBy]);

  const handleSend = (msg) => {
    setMessages([msg, ...messages]);
    setShowForm(false);
    setEditingMsg(null);
    alert("Message sent!");
  };

  const handleUpdate = (msg) => {
    setMessages(messages.map((m) => (m._id === msg._id ? msg : m)));
    setShowForm(false);
    setEditingMsg(null);
    alert("Message updated!");
  };

  if (showForm)
    return (
      <ContactForm
        onSend={handleSend}
        onBack={() => {
          setShowForm(false);
          setEditingMsg(null);
        }}
        editingMsg={editingMsg}
        onUpdate={handleUpdate}
      />
    );

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>💬 Inbox</h3>
        <div>
          <span className="badge bg-primary me-2">Unread: {messages.filter((m) => !m.read).length}</span>
          <button className="btn btn-sm btn-success" onClick={() => setShowForm(true)}>Contact</button>
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
        <select
          className="form-select form-select-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {filtered.map((m) => (
            <div key={m._id} className={`card mb-2 ${!m.read ? "border-primary" : ""}`}>
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h6 style={{ fontWeight: !m.read ? 700 : 500 }}>
                    {m.sender} ➔ {m.receiver}: {m.subject}
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
                  <button
                    className="btn btn-sm btn-outline-warning me-1"
                    onClick={() => {
                      setEditingMsg(m);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card p-3 mb-3">
            <h6>📢 Announcements</h6>
            <ul className="list-unstyled">
              {announcements.map((a) => (
                <li key={a._id} className="mb-2">
                  <strong>{a.message}</strong>
                  <div className="small text-muted">
                    {a.audience} • {new Date(a.date).toLocaleDateString()}
                  </div>
                </li>
              ))}
              {announcements.length === 0 && <div className="small text-muted">No announcements</div>}
            </ul>
          </div>

          <div className="card p-3">
            <h6>📅 Events</h6>
            <ul className="list-unstyled">
              {events.map((e) => (
                <li key={e._id} className="mb-2">
                  <strong>{e.title || e.message}</strong>
                  <div className="small text-muted">{new Date(e.date).toLocaleDateString()}</div>
                </li>
              ))}
              {events.length === 0 && <div className="small text-muted">No events</div>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
