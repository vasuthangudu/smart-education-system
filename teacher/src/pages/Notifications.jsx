import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const API_ADMIN = "http://localhost:5007/api/messages"; // Admin messages
const API_STUDENT = "http://localhost:5003/api/messages"; // Student messages

export default function TeacherNotifications() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read / Pin / Acknowledge state maps
  const [readMap, setReadMap] = useState({});
  const [pinnedMap, setPinnedMap] = useState({});
  const [ackMap, setAckMap] = useState({});

  const unreadCount = useMemo(
    () => messages.filter((m) => !readMap[m._id]).length,
    [messages, readMap]
  );

  const toggleRead = (id) => setReadMap((m) => ({ ...m, [id]: !m[id] }));
  const togglePin = (id) => setPinnedMap((m) => ({ ...m, [id]: !m[id] }));
  const toggleAck = (id) => setAckMap((m) => ({ ...m, [id]: !m[id] }));

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const [resAdmin, resStudent] = await Promise.all([
          fetch(API_ADMIN),
          fetch(API_STUDENT),
        ]);

        const dataAdmin = await resAdmin.json();
        const dataStudent = await resStudent.json();

        // Filter only messages for Teacher
        const teacherMsgs = [
          ...dataAdmin,
          ...dataStudent,
        ].filter(
          (msg) =>
            msg.receiver?.toLowerCase() === "teacher" ||
            msg.receiver === "Mr. Smith (Teacher)"
        );

        // Sort by newest first
        teacherMsgs.sort(
          (a, b) => new Date(b.createdAt || b.dateTime) - new Date(a.createdAt || a.dateTime)
        );

        setMessages(teacherMsgs);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📬 Teacher Notifications</h3>
        <span className="badge bg-primary">Unread: {unreadCount}</span>
      </div>

      {loading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : messages.length === 0 ? (
        <p>No messages for teacher.</p>
      ) : (
        messages.map((msg) => {
          const isUnread = !readMap[msg._id];
          const isPinned = !!pinnedMap[msg._id];
          const isAck = !!ackMap[msg._id];

          return (
            <div
              key={msg._id}
              className={`card mb-3 ${isUnread ? "border-primary" : ""}`}
            >
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h6 style={{ fontWeight: isUnread ? 700 : 500 }}>
                    🎓 {msg.subject || "(No Subject)"}
                  </h6>
                  <p>{msg.message}</p>
                  <small className="text-muted">
                    From: {msg.sender} • To: {msg.receiver} •{" "}
                    {new Date(msg.createdAt || msg.dateTime).toLocaleString()}
                  </small>

                  {/* Attachments */}
                  <div className="mt-2">
                    {msg.attachments?.map((att) => {
                      const url =
                        att.url ||
                        (att.path
                          ? `http://localhost:5007${att.path}`
                          : "#");
                      return (
                        <a
                          key={att._id || att.name}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="badge bg-secondary me-1"
                        >
                          📎 {att.name}
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="text-end">
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() => toggleRead(msg._id)}
                  >
                    {isUnread ? "Mark read" : "Mark unread"}
                  </button>
                  <button
                    className={`btn btn-sm ${
                      isPinned ? "btn-success" : "btn-outline-success"
                    } me-1`}
                    onClick={() => togglePin(msg._id)}
                  >
                    {isPinned ? "Pinned" : "Pin"}
                  </button>
                  <button
                    className={`btn btn-sm ${
                      isAck ? "btn-warning" : "btn-outline-warning"
                    }`}
                    onClick={() => toggleAck(msg._id)}
                  >
                    {isAck ? "Acknowledged ✓" : "Acknowledge"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
