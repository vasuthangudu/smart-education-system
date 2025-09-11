import React, { useState } from "react";
import jsPDF from "jspdf";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "bootstrap/dist/css/bootstrap.min.css";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const timeSlots = ["09:00-10:00","10:00-11:00","11:00-12:00","12:00-01:00","02:00-03:00","03:00-04:00"];

const subjectColors = {
  Math: "primary", Science: "success", English: "warning",
  History: "info", Physics: "danger", Default: "secondary",
};

export default function Timetable() {
  const todayIndex = new Date().getDay() - 1; // Monday=0
  const [timetable, setTimetable] = useState({});
  const [filter, setFilter] = useState("");
  const [modalData, setModalData] = useState(null); // {day,slot,subject,class,room}

  // Open Add/Edit Modal
  const handleAddEdit = (day, slot) => {
    const key = `${day}-${slot}`;
    const data = timetable[key] || { subject: "", class: "", room: "" };
    setModalData({ day, slot, ...data });
  };

  // Save Slot with conflict detection
  const saveSlot = () => {
    const { day, slot, subject, class: cls, room } = modalData;
    if (!subject || !cls || !room) {
      alert("Please fill all fields.");
      return;
    }
    // conflict detection
    const conflict = Object.keys(timetable).find(
      (k) =>
        k !== `${day}-${slot}` &&
        timetable[k].class === cls &&
        timetable[k].room === room &&
        k.split("-")[1] === slot
    );
    if (conflict) {
      alert("Conflict detected: Another class is using the same room/slot.");
      return;
    }
    setTimetable({
      ...timetable,
      [`${day}-${slot}`]: { subject, class: cls, room },
    });
    setModalData(null);
  };

  const deleteSlot = (day, slot) => {
    const updated = { ...timetable };
    delete updated[`${day}-${slot}`];
    setTimetable(updated);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Teacher Timetable", 14, 16);
    let y = 25;
    days.forEach((day) => {
      doc.text(day, 14, y);
      y += 6;
      timeSlots.forEach((slot) => {
        const data = timetable[`${day}-${slot}`];
        if (data) {
          doc.text(`• ${slot}: ${data.subject} (${data.class}) Room: ${data.room}`, 20, y);
          y += 6;
        }
      });
      y += 4;
    });
    doc.save("timetable.pdf");
  };

  const getBadgeColor = (subject) => subjectColors[subject] || subjectColors.Default;

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const [srcDay, srcSlot] = result.source.droppableId.split("|");
    const [destDay, destSlot] = result.destination.droppableId.split("|");
    const key = `${srcDay}-${srcSlot}`;
    const movedData = timetable[key];
    const updated = { ...timetable };
    delete updated[key];
    updated[`${destDay}-${destSlot}`] = movedData;
    setTimetable(updated);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">📅 Teacher Timetable</h2>

      {/* Search and Export */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by subject or class"
          value={filter}
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
        />
        <button className="btn btn-outline-primary" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Time</th>
                {days.map((day, dIndex) => (
                  <th key={day} className={dIndex === todayIndex ? "table-primary" : ""}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td className="fw-bold">{slot}</td>
                  {days.map((day, dIndex) => {
                    const key = `${day}-${slot}`;
                    const data = timetable[key];
                    const isToday = dIndex === todayIndex;
                    const matchesFilter =
                      !filter ||
                      (data &&
                        (data.subject.toLowerCase().includes(filter) ||
                          data.class.toLowerCase().includes(filter)));
                    return (
                      <Droppable key={`${day}|${slot}`} droppableId={`${day}|${slot}`}>
                        {(provided) => (
                          <td
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={isToday ? "bg-light" : ""}
                            style={{ cursor: "pointer", minWidth: "140px" }}
                            onClick={() => handleAddEdit(day, slot)}
                          >
                            {data && matchesFilter ? (
                              <Draggable draggableId={key} index={0}>
                                {(dragProvided) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                  >
                                    <span className={`badge bg-${getBadgeColor(data.subject)} mb-1`}>
                                      {data.subject}
                                    </span>
                                    <div className="small">{data.class}</div>
                                    <div className="small">Room {data.room}</div>
                                    <div className="d-flex justify-content-center">
                                      <button
                                        className="btn btn-sm btn-outline-danger mt-1"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteSlot(day, slot);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ) : !data && !filter ? (
                              <span className="text-muted">+</span>
                            ) : null}
                            {provided.placeholder}
                          </td>
                        )}
                      </Droppable>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DragDropContext>

      {/* Modal */}
      {modalData && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {timetable[`${modalData.day}-${modalData.slot}`] ? "Edit" : "Add"} Slot
                </h5>
                <button type="button" className="btn-close" onClick={() => setModalData(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={modalData.subject}
                    onChange={(e) => setModalData({ ...modalData, subject: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Class/Section</label>
                  <input
                    type="text"
                    className="form-control"
                    value={modalData.class}
                    onChange={(e) => setModalData({ ...modalData, class: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Room</label>
                  <input
                    type="text"
                    className="form-control"
                    value={modalData.room}
                    onChange={(e) => setModalData({ ...modalData, room: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalData(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveSlot}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
