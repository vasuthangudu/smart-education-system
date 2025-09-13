import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Communication() {
  const [messages, setMessages] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [query, setQuery] = useState("");
  const [senderFilter, setSenderFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [detail, setDetail] = useState(null);

  // Fetch messages from backend
  useEffect(() => {
    fetch("http://localhost:5001/api/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching:", err));
  }, []);

  const toggleRead = (id) =>
    setMessages((msgs) =>
      msgs.map((m) => (m._id === id ? { ...m, read: !m.read } : m))
    );

  const togglePin = (id) =>
    setMessages((msgs) =>
      msgs.map((m) => (m._id === id ? { ...m, pinned: !m.pinned } : m))
    );

  const filtered = useMemo(() => {
    let list = [...messages];
    if (query)
      list = list.filter(
        (m) =>
          m.subject?.toLowerCase().includes(query.toLowerCase()) ||
          m.message?.toLowerCase().includes(query.toLowerCase())
      );
    if (senderFilter !== "All") list = list.filter((m) => m.sender.includes(senderFilter));
    if (categoryFilter !== "All") list = list.filter((m) => m.category === categoryFilter);
    if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return list;
  }, [messages, query, senderFilter, categoryFilter, sortBy]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const handleSendMessage = async (newMsg) => {
    const formData = new FormData();
    Object.keys(newMsg).forEach((k) => {
      if (k !== "attachments") formData.append(k, newMsg[k]);
    });
    (newMsg.attachments || []).forEach((file) => formData.append("attachments", file));

    const res = await fetch("http://localhost:5001/api/messages", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      setMessages([data.data, ...messages]);
      alert("Message sent successfully!");
      setShowContactForm(false);
    } else {
      alert("Error sending message");
    }
  };

  if (showContactForm) {
    return (
      <ContactForm onSend={handleSendMessage} onBack={() => setShowContactForm(false)} />
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>💬 Inbox</h3>
        <div>
          <span className="badge bg-primary me-2">Unread: {unreadCount}</span>
          <button
            className="btn btn-sm btn-success"
            onClick={() => setShowContactForm(true)}
          >
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
        <select
          className="form-select form-select-sm"
          value={senderFilter}
          onChange={(e) => setSenderFilter(e.target.value)}
        >
          <option>All</option>
          <option>Admin</option>
          <option>Teacher</option>
        </select>
        <select
          className="form-select form-select-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option>All</option>
          <option>Announcement</option>
          <option>Assignment</option>
          <option>Query</option>
        </select>
        <select
          className="form-select form-select-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {filtered.length === 0 && <div className="alert alert-info">No messages found.</div>}
          {filtered.map((m) => (
            <div key={m._id} className={`card mb-2 ${!m.read ? "border-primary" : ""}`}>
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h6 style={{ fontWeight: !m.read ? 700 : 500 }}>
                    {m.sender}: {m.subject}
                  </h6>
                  <div className="small text-muted">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                  <div>{m.message}</div>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => toggleRead(m._id)}
                  >
                    {!m.read ? "Mark Read" : "Mark Unread"}
                  </button>
                  <button
                    className={`btn btn-sm ${
                      m.pinned ? "btn-success" : "btn-outline-success"
                    } me-1`}
                    onClick={() => togglePin(m._id)}
                  >
                    {m.pinned ? "Pinned" : "Pin"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setDetail(m)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card p-3">
            <h6>Pinned</h6>
            {messages.filter((m) => m.pinned).length === 0 ? (
              <div className="text-muted small">No pinned messages</div>
            ) : (
              <ul>
                {messages
                  .filter((m) => m.pinned)
                  .map((m) => (
                    <li key={m._id}>
                      <strong>{m.subject}</strong>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {detail && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{detail.subject}</h5>
                <button className="btn-close" onClick={() => setDetail(null)}></button>
              </div>
              <div className="modal-body">
                <p>{detail.message}</p>
                {detail.attachments?.length > 0 && (
                  <>
                    <h6>Attachments</h6>
                    <ul>
                      {detail.attachments.map((a, i) => (
                        <li key={i}>
                          <a href={`http://localhost:5001${a.url}`} target="_blank" rel="noreferrer">
                            {a.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactForm({ onSend, onBack }) {
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiver || !subject || !message) return alert("All fields required");
    onSend({
      sender: "student123",
      receiver,
      subject,
      message,
      attachments,
    });
  };

  return (
    <div className="card p-3">
      <h5>📩 Send Message</h5>
      <form onSubmit={handleSubmit}>
        <select
          className="form-select mb-2"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        >
          <option value="">Select Receiver</option>
          <option value="Admin">Admin</option>
          <option value="Mr. Smith (Teacher)">Mr. Smith (Teacher)</option>
        </select>
        <input
          className="form-control mb-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <input
          type="file"
          multiple
          className="form-control mb-2"
          onChange={(e) => setAttachments([...e.target.files])}
        />
        <button className="btn btn-primary me-2">Send</button>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      </form>
    </div>
  );
}
