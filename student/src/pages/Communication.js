// StudentCommunication.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentCommunication() {
  const [showForm, setShowForm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_MESSAGES = "http://localhost:5003/api/messages";

  // Fetch messages (Inbox)
  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_MESSAGES);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!receiver || !subject.trim() || !message.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("sender", "student123"); // Replace with actual logged-in student ID
    formData.append("receiver", receiver);
    formData.append("subject", subject);
    formData.append("message", message);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      setLoading(true);
      await axios.post(API_MESSAGES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Message sent successfully!");

      // Reset form
      setReceiver("");
      setSubject("");
      setMessage("");
      setAttachments([]);

      // Go back to inbox and refresh
      setShowForm(false);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("❌ Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>📩 {showForm ? "Contact Admin / Teacher" : "Inbox"}</h5>
          {showForm && (
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Back to Inbox
            </button>
          )}
        </div>

        {!showForm ? (
          // Inbox View
          <div>
            <button
              className="btn btn-primary mb-3"
              onClick={() => setShowForm(true)}
            >
              ✉ Contact
            </button>

            {messages.length === 0 ? (
              <p className="text-muted">No messages found.</p>
            ) : (
              <ul className="list-group">
                {messages.map((msg) => (
                  <li key={msg._id} className="list-group-item">
                    <strong>{msg.subject}</strong> <br />
                    <small>
                      From: {msg.sender} | To: {msg.receiver} |{" "}
                      {new Date(msg.dateTime).toLocaleString()}
                    </small>
                    <p className="mb-1">{msg.message}</p>
                    {msg.attachments?.length > 0 && (
                      <div>
                        <strong>Attachments:</strong>
                        <ul>
                          {msg.attachments.map((file, idx) => (
                            <li key={idx}>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {file.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          // Form View
          <form onSubmit={handleSubmit}>
            {/* Receiver */}
            <div className="mb-3">
              <label className="form-label">Send To</label>
              <select
                className="form-select"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
              >
                <option value="">Select Receiver</option>
                <option value="Admin">Admin</option>
                <option value="Mr. Smith (Teacher)">Mr. Smith (Teacher)</option>
                <option value="Mrs. Johnson (Teacher)">
                  Mrs. Johnson (Teacher)
                </option>
              </select>
            </div>

            {/* Subject */}
            <div className="mb-3">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>

            {/* Message */}
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                required
              ></textarea>
            </div>

            {/* Attachments */}
            <div className="mb-3">
              <label className="form-label">Attachments (optional)</label>
              <input
                type="file"
                multiple
                className="form-control"
                onChange={handleFileChange}
              />
              {attachments.length > 0 && (
                <ul className="mt-2 small">
                  {attachments.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}