import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Notifications() {
  const [messages, setMessages] = useState([]);

  // Fetch messages from both URLs
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Original messages
        const res1 = await fetch("http://localhost:5001/api/messages");
        const data1 = await res1.json();

        // Admin → Teacher messages from additional URL
        const res2 = await fetch("http://localhost:5007/api/messages");
        const data2 = await res2.json();

        // Filter only Admin → Teacher messages from second URL
        const adminTeacherMsgs = data2.filter(
          (msg) =>
            msg.sender?.trim().toLowerCase() === "admin" &&
            msg.receiver?.trim().toLowerCase() === "teacher"
        );

        // Merge with existing messages
        const merged = [...data1, ...adminTeacherMsgs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setMessages(merged);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, []);

  // Read/Pin/Acknowledge state maps
  const [readMap, setReadMap] = useState({});
  const [pinnedMap, setPinnedMap] = useState({});
  const [likedMap, setLikedMap] = useState({});

  const unreadCount = useMemo(
    () => messages.filter((m) => !readMap[m._id]).length,
    [messages, readMap]
  );

  const toggleRead = (id) => setReadMap((m) => ({ ...m, [id]: !m[id] }));
  const togglePin = (id) => setPinnedMap((m) => ({ ...m, [id]: !m[id] }));
  const toggleLike = (id) => setLikedMap((m) => ({ ...m, [id]: !m[id] }));

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📬 Teacher Messages</h3>
        <span className="badge bg-primary">Unread: {unreadCount}</span>
      </div>

      {messages.length === 0 ? (
        <p>No messages for teachers.</p>
      ) : (
        messages.map((msg) => {
          const isUnread = !readMap[msg._id];
          const isPinned = !!pinnedMap[msg._id];
          const isLiked = !!likedMap[msg._id];

          return (
            <div
              key={msg._id}
              className={`card mb-2 ${isUnread ? "border-primary" : ""}`}
            >
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h6 style={{ fontWeight: isUnread ? 700 : 500 }}>
                    🎓 {msg.subject || "(No Subject)"}
                  </h6>
                  <p className="mb-1">{msg.message}</p>
                  <small className="text-muted">
                    From: {msg.sender} • {msg.receiver} •{" "}
                    {new Date(msg.createdAt).toLocaleString()}
                  </small>

                  {/* Attachments */}
                  <div className="mt-2">
                    {msg.attachments?.map((att) => {
                      const url = att.url || `http://localhost:5007${att.path}`;
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
                      isLiked ? "btn-warning" : "btn-outline-warning"
                    }`}
                    onClick={() => toggleLike(msg._id)}
                  >
                    {isLiked ? "Acknowledged ✓" : "Acknowledge"}
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
