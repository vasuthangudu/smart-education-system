import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminMessagesCombined() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch from first API
        const res1 = await axios.get("http://localhost:5003/api/messages");
        // Fetch from second API
        const res2 = await axios.get("http://localhost:5005/api/messages");

        // Combine and filter messages for Admin
        const combined = [...res1.data, ...res2.data].filter(
          (msg) => msg.receiver === "Admin"
        );

        // Sort by dateTime or createdAt descending
        combined.sort((a, b) => new Date(b.dateTime || b.createdAt) - new Date(a.dateTime || a.createdAt));

        setMessages(combined);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  // Determine card color based on priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "border-danger text-danger";
      case "Normal":
        return "border-primary text-primary";
      case "Low":
        return "border-success text-success";
      default:
        return "border-secondary text-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">📨 Messages for Admin (Combined)</h2>

      {messages.length === 0 ? (
        <div className="alert alert-info">No messages for Admin</div>
      ) : (
        <div className="row">
          {messages.map((msg) => (
            <div className="col-md-6 mb-3" key={msg._id}>
              <div className={`card shadow-sm ${getPriorityClass(msg.priority)}`}>
                <div className="card-body">
                  <h5 className="card-title">{msg.subject}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">From: {msg.sender}</h6>
                  <p className="card-text">{msg.message}</p>
                  <p className="mb-1">
                    <strong>Date:</strong> {new Date(msg.dateTime || msg.createdAt).toLocaleString()}
                  </p>
                  {msg.category && <p className="mb-1"><strong>Category:</strong> {msg.category}</p>}
                  {msg.priority && <p className="mb-1"><strong>Priority:</strong> {msg.priority}</p>}

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2">
                      <strong>Attachments:</strong>
                      <ul>
                        {msg.attachments.map((att) => (
                          <li key={att._id}>
                            {att.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                              <img
                                src={`http://localhost:5003${att.url}`}
                                alt={att.name}
                                className="img-fluid mb-2"
                                style={{ maxHeight: "150px" }}
                              />
                            ) : null}
                            <a
                              href={`http://localhost:5003${att.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="d-block"
                            >
                              {att.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Replies */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="mt-2">
                      <strong>Replies:</strong>
                      <ul>
                        {msg.replies.map((r, i) => (
                          <li key={i}>
                            <strong>{r.sender}:</strong> {r.message} <em>({new Date(r.dateTime).toLocaleString()})</em>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
