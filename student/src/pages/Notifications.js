import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// ---------- Sample data ----------
const initialData = {
  upcomingEvents: [
    {
      id: "e1",
      eventTitle: "Math Quiz on Algebra",
      dateTime: "2025-09-20T10:00:00",
      organizer: "Mr. John (Teacher)",
      locationOrLink: "Room 102",
      category: "Exam",
      priority: "High",
      addToCalendar: true
    },
    {
      id: "e2",
      eventTitle: "Scholarship Seminar",
      dateTime: "2025-09-25T15:00:00",
      organizer: "Admin Office",
      locationOrLink: "https://zoom.example.com/seminar",
      category: "Seminar",
      priority: "Normal",
      addToCalendar: true
    }
  ],
  announcements: [
    {
      id: 101,
      title: "Campus Closure Due to Maintenance",
      message: "The campus will be closed on Sept 22 for maintenance. All classes postponed.",
      priority: "Urgent",
      attachments: [{ name: "maintenance-details.pdf", url: "/resources/maintenance-details.pdf" }],
      dateTime: "2025-09-10T09:00:00",
      sender: "Admin Office",
      role: "Admin",
      category: "General"
    },
    {
      id: 102,
      title: "Assignment Deadline Extended",
      message: "The Physics assignment deadline has been extended to Sept 18.",
      priority: "Info",
      attachments: [],
      dateTime: "2025-09-09T12:30:00",
      sender: "Ms. Smith",
      role: "Teacher",
      category: "Assignment",
      subjectBadge: "Physics"
    }
  ]
};

export default function Notifications() {
  // data
  const [events] = useState(initialData.upcomingEvents);
  const [announcements] = useState(initialData.announcements);

  // Combine announcements + events
  const combined = useMemo(() => {
    const anns = announcements.map(a => ({ ...a, kind: "announcement", id: `ann-${a.id}` }));
    const evs = events.map(e => ({ ...e, kind: "event", id: `ev-${e.id}`, title: e.eventTitle }));
    return [...anns, ...evs];
  }, [announcements, events]);

  // Persisted state
  const [readMap, setReadMap] = useState(() => JSON.parse(localStorage.getItem("ntf_read") || "{}"));
  const [pinnedMap, setPinnedMap] = useState(() => JSON.parse(localStorage.getItem("ntf_pinned") || "{}"));
  const [likedMap, setLikedMap] = useState(() => JSON.parse(localStorage.getItem("ntf_liked") || "{}"));

  // Persist maps
  React.useEffect(() => localStorage.setItem("ntf_read", JSON.stringify(readMap)), [readMap]);
  React.useEffect(() => localStorage.setItem("ntf_pinned", JSON.stringify(pinnedMap)), [pinnedMap]);
  React.useEffect(() => localStorage.setItem("ntf_liked", JSON.stringify(likedMap)), [likedMap]);

  // small UI helpers
  const unreadCount = useMemo(() => combined.filter(i => !readMap[i.id]).length, [combined, readMap]);

  // Toggle functions
  const toggleRead = id => setReadMap(m => ({ ...m, [id]: !m[id] }));
  const togglePin = id => setPinnedMap(m => ({ ...m, [id]: !m[id] }));
  const toggleLike = id => setLikedMap(m => ({ ...m, [id]: !m[id] }));

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>📢 Notifications & Announcements</h3>
        <span className="badge bg-primary">Unread: {unreadCount}</span>
      </div>

      {/* notifications list */}
      <div className="row">
        <div className="col-lg-12">
          {combined.map(n => {
            const isUnread = !readMap[n.id];
            const isPinned = !!pinnedMap[n.id];
            const isLiked = !!likedMap[n.id];
            return (
              <div key={n.id} className={`card mb-2 ${isUnread ? "border-primary" : ""}`}>
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h6 style={{ fontWeight: isUnread ? 700 : 500 }}>
                      {n.kind === "event" ? "📅 " : n.role === "Admin" ? "🛠️ " : "👨‍🏫 "}
                      {n.title || n.eventTitle}
                    </h6>
                    <div className="small text-muted">{n.sender} • {new Date(n.dateTime).toLocaleString()}</div>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => toggleRead(n.id)}>
                      {isUnread ? "Mark read" : "Mark unread"}
                    </button>
                    <button className={`btn btn-sm ${isPinned ? "btn-success" : "btn-outline-success"} me-1`} onClick={() => togglePin(n.id)}>
                      {isPinned ? "Pinned" : "Pin"}
                    </button>
                    <button className={`btn btn-sm ${isLiked ? "btn-warning" : "btn-outline-warning"}`} onClick={() => toggleLike(n.id)}>
                      {isLiked ? "Acknowledged ✓" : "Acknowledge"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
