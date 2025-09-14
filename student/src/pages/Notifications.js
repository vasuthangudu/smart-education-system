import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_EVENTS = "http://localhost:5004/api/events";
const API_ANNOUNCEMENTS = "http://127.0.0.1:5004/api/announcements";
const API_MESSAGES = "http://localhost:5005/api/messages";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Fetch events + announcements + messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, annsRes, msgsRes] = await Promise.all([
          axios.get(API_EVENTS),
          axios.get(API_ANNOUNCEMENTS),
          axios.get(API_MESSAGES),
        ]);

        // ✅ Only student announcements
        const studentAnnouncements = annsRes.data.filter(
          (a) => a.audience === "Students"
        );

        // Normalize announcements
        const anns = studentAnnouncements.map((a) => ({
          id: `ann-${a._id}`,
          kind: "announcement",
          title: "📢 Announcement",
          message: a.message,
          dateTime: a.date,
          sender: "Admin / Teacher",
        }));

        // Normalize events
        const evs = eventsRes.data.map((e) => ({
          id: `ev-${e._id}`,
          kind: "event",
          title: "📅 Event",
          message: e.message,
          dateTime: e.date,
          sender: "Admin / Teacher",
        }));

        // Normalize messages
        const msgs = msgsRes.data.map((m) => ({
          id: `msg-${m._id}`,
          kind: "message",
          title: "✉️ Message",
          message: m.message || "(no content)",
          dateTime: m.date || new Date().toISOString(),
          sender: m.sender || "Unknown",
        }));

        // Merge + sort
        const merged = [...anns, ...evs, ...msgs].sort(
          (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        );

        setNotifications(merged);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  // State for read/pin/like
  const [readMap, setReadMap] = useState(
    () => JSON.parse(localStorage.getItem("ntf_read") || "{}")
  );
  const [pinnedMap, setPinnedMap] = useState(
    () => JSON.parse(localStorage.getItem("ntf_pinned") || "{}")
  );
  const [likedMap, setLikedMap] = useState(
    () => JSON.parse(localStorage.getItem("ntf_liked") || "{}")
  );

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("ntf_read", JSON.stringify(readMap));
  }, [readMap]);
  useEffect(() => {
    localStorage.setItem("ntf_pinned", JSON.stringify(pinnedMap));
  }, [pinnedMap]);
  useEffect(() => {
    localStorage.setItem("ntf_liked", JSON.stringify(likedMap));
  }, [likedMap]);

  // Count unread
  const unreadCount = useMemo(
    () => notifications.filter((n) => !readMap[n.id]).length,
    [notifications, readMap]
  );

  // Toggle helpers
  const toggleRead = (id) => setReadMap((m) => ({ ...m, [id]: !m[id] }));
  const togglePin = (id) => setPinnedMap((m) => ({ ...m, [id]: !m[id] }));
  const toggleLike = (id) => setLikedMap((m) => ({ ...m, [id]: !m[id] }));

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📢 Notifications</h3>
        <span className="badge bg-primary">Unread: {unreadCount}</span>
      </div>

      <div className="row">
        <div className="col-lg-12">
          {notifications.length === 0 ? (
            <div className="alert alert-info">No notifications available.</div>
          ) : (
            notifications.map((n) => {
              const isUnread = !readMap[n.id];
              const isPinned = !!pinnedMap[n.id];
              const isLiked = !!likedMap[n.id];

              return (
                <div
                  key={n.id}
                  className={`card mb-2 ${isUnread ? "border-primary" : ""}`}
                >
                  <div className="card-body d-flex justify-content-between align-items-start">
                    <div>
                      <h6 style={{ fontWeight: isUnread ? 700 : 500 }}>
                        {n.title}
                      </h6>
                      <div className="small text-muted">
                        {n.sender} •{" "}
                        {new Date(n.dateTime).toLocaleDateString()}
                      </div>
                      <p className="mb-1">{n.message}</p>
                    </div>
                    <div className="text-end">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => toggleRead(n.id)}
                      >
                        {isUnread ? "Mark read" : "Mark unread"}
                      </button>
                      <button
                        className={`btn btn-sm ${
                          isPinned ? "btn-success" : "btn-outline-success"
                        } me-1`}
                        onClick={() => togglePin(n.id)}
                      >
                        {isPinned ? "Pinned" : "Pin"}
                      </button>
                      <button
                        className={`btn btn-sm ${
                          isLiked ? "btn-warning" : "btn-outline-warning"
                        }`}
                        onClick={() => toggleLike(n.id)}
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
      </div>
    </div>
  );
}
