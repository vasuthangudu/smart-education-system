import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import jsPDF from "jspdf";
import "jspdf-autotable";

// ✅ Subject colors
const subjectColors = {
  Math: "primary",
  Science: "success",
  English: "info",
  History: "warning",
  Geography: "secondary",
  Computer: "dark",
};

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [newEntry, setNewEntry] = useState({
    class: "",
    section: "",
    subject: "",
    teacher: "",
    day: "",
    start: "",
    end: "",
    room: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState({ class: "", teacher: "", day: "" });
  const [view, setView] = useState("list");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const classes = ["Class 1", "Class 2", "Class 3"];
  const sections = ["A", "B", "C"];
  const subjects = ["Math", "Science", "English", "History", "Geography", "Computer"];
  const teachers = ["Mr. Smith", "Ms. Johnson", "Mr. Brown", "Mrs. Lee"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // ✅ Toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ Conflict detection
  const hasConflict = (entry, indexToIgnore = null) => {
    return timetable.some((e, idx) => {
      if (idx === indexToIgnore) return false;
      return (
        e.day === entry.day &&
        (e.class === entry.class || e.teacher === entry.teacher || e.room === entry.room) &&
        ((entry.start >= e.start && entry.start < e.end) ||
          (entry.end > e.start && entry.end <= e.end))
      );
    });
  };

  // ✅ Add / Update
  const handleSubmit = () => {
    if (!newEntry.class || !newEntry.section || !newEntry.subject || !newEntry.teacher || !newEntry.day || !newEntry.start || !newEntry.end) {
      showToast("All fields are required!", "danger");
      return;
    }
    if (newEntry.start >= newEntry.end) {
      showToast("Start time must be before End time!", "warning");
      return;
    }
    if (hasConflict(newEntry, editIndex)) {
      showToast("Conflict detected!", "danger");
      return;
    }

    if (editIndex !== null) {
      const updated = [...timetable];
      updated[editIndex] = newEntry;
      setTimetable(updated);
      showToast("Entry updated!");
      setEditIndex(null);
    } else {
      setTimetable([...timetable, newEntry]);
      showToast("Entry added!");
    }

    setNewEntry({ class: "", section: "", subject: "", teacher: "", day: "", start: "", end: "", room: "" });
  };

  const handleDelete = (index) => {
    setTimetable(timetable.filter((_, i) => i !== index));
    showToast("Entry deleted!", "danger");
  };

  const handleEdit = (index) => {
    setNewEntry(timetable[index]);
    setEditIndex(index);
  };

  // ✅ Filtered data
  const filteredTimetable = timetable.filter(
    (e) =>
      (!filter.class || e.class === filter.class) &&
      (!filter.teacher || e.teacher === filter.teacher) &&
      (!filter.day || e.day === filter.day)
  );

  // ✅ Generate time slots (08:00 → 18:00 every 1 hour)
  const generateTimeSlots = (start = "08:00", end = "18:00") => {
    const slots = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    while (h < endH || (h === endH && m < endM)) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      h++;
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  return (
    <div className="container my-4">
      <h2 className="mb-3">Admin Timetable Management</h2>

      {/* Toast */}
      {toast.show && (
        <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3`} style={{ zIndex: 2000 }}>
          {toast.message}
        </div>
      )}

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        <select className="form-select" onChange={(e) => setFilter({ ...filter, class: e.target.value })}>
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="form-select" onChange={(e) => setFilter({ ...filter, teacher: e.target.value })}>
          <option value="">All Teachers</option>
          {teachers.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select className="form-select" onChange={(e) => setFilter({ ...filter, day: e.target.value })}>
          <option value="">All Days</option>
          {days.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <button className="btn btn-outline-primary" onClick={() => setView(view === "list" ? "grid" : "list")}>
          Switch to {view === "list" ? "Grid" : "List"} View
        </button>
      </div>

      {/* Add/Edit Form */}
      <div className="card p-3 mb-4">
        <h5>{editIndex !== null ? "Edit Entry" : "Add New Entry"}</h5>
        <div className="row g-2">
          <div className="col-md-2">
            <select className="form-select" value={newEntry.class} onChange={(e) => setNewEntry({ ...newEntry, class: e.target.value })}>
              <option value="">Class</option>
              {classes.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <select className="form-select" value={newEntry.section} onChange={(e) => setNewEntry({ ...newEntry, section: e.target.value })}>
              <option value="">Sec</option>
              {sections.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={newEntry.subject} onChange={(e) => setNewEntry({ ...newEntry, subject: e.target.value })}>
              <option value="">Subject</option>
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={newEntry.teacher} onChange={(e) => setNewEntry({ ...newEntry, teacher: e.target.value })}>
              <option value="">Teacher</option>
              {teachers.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={newEntry.day} onChange={(e) => setNewEntry({ ...newEntry, day: e.target.value })}>
              <option value="">Day</option>
              {days.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-1">
            <input type="time" className="form-control" value={newEntry.start} onChange={(e) => setNewEntry({ ...newEntry, start: e.target.value })} />
          </div>
          <div className="col-md-1">
            <input type="time" className="form-control" value={newEntry.end} onChange={(e) => setNewEntry({ ...newEntry, end: e.target.value })} />
          </div>
          <div className="col-md-1">
            <input type="text" placeholder="Room" className="form-control" value={newEntry.room} onChange={(e) => setNewEntry({ ...newEntry, room: e.target.value })} />
          </div>
          <div className="col-md-12 mt-2">
            <button className="btn btn-success me-2" onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Add"}
            </button>
            {editIndex !== null && (
              <button className="btn btn-secondary" onClick={() => setEditIndex(null)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List View */}
      {view === "list" && (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimetable.map((e, i) => (
              <tr key={i}>
                <td>{e.class}</td>
                <td>{e.section}</td>
                <td><span className={`badge bg-${subjectColors[e.subject] || "secondary"}`}>{e.subject}</span></td>
                <td>{e.teacher}</td>
                <td>{e.day}</td>
                <td>{e.start}</td>
                <td>{e.end}</td>
                <td>{e.room}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead>
              <tr>
                <th>Time</th>
                {days.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td>{time}</td>
                  {days.map((d) => {
                    const slots = timetable.filter((e) => e.day === d && e.start <= time && e.end > time);
                    return (
                      <td key={d + time}>
                        {slots.length > 0 ? (
                          slots.map((slot, idx) => (
                            <div key={idx} className={`p-1 mb-1 text-white rounded bg-${subjectColors[slot.subject] || "secondary"}`}>
                              <strong>{slot.subject}</strong> <br />
                              {slot.teacher} <br />
                              ({slot.start} - {slot.end}) <br />
                              {slot.room}
                            </div>
                          ))
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
