import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StudentCommunicationForm({ onSend, onBack }) {
  const [receiver, setReceiver] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiver || !subject.trim() || !message.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "student123", // Replace with logged-in student's ID
      receiver,
      subject,
      message,
      attachments: attachments.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file), // Preview purpose
      })),
      dateTime: new Date().toISOString(),
      category: "Query",
      priority: "Normal",
      read: false,
      pinned: false,
      replies: [],
    };

    onSend(newMessage);

    // Reset form
    setReceiver("");
    setSubject("");
    setMessage("");
    setAttachments([]);
  };

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>📩 Contact Admin / Teacher</h5>
        <button className="btn btn-sm btn-secondary" onClick={onBack}>
          Back to Inbox
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Receiver Selection */}
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
            <option value="Mrs. Johnson (Teacher)">Mrs. Johnson (Teacher)</option>
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
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
