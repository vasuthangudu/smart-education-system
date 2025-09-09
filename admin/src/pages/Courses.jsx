import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TeacherCoursesCards() {
  const allCourses = ["Math 101", "Physics 101", "Chemistry 101", "Biology 101"];

  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: "Bob Williams", 
      role: "Teacher", 
      courses: ["Physics 101"], 
      date: "2025-08-15", 
      videos: ["https://www.youtube.com/embed/dQw4w9WgXcQ"] 
    },
    { 
      id: 2, 
      name: "David Smith", 
      role: "Teacher", 
      courses: ["Math 101", "Physics 101"], 
      date: "2025-09-05", 
      videos: ["https://www.youtube.com/embed/3JZ_D3ELwOQ"] 
    },
  ]);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [editTeacher, setEditTeacher] = useState(null);

  // Filtered teachers
  const filteredTeachers = teachers.filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (courseFilter === "All" || t.courses.some(c => c === courseFilter))
  );

  // Add or Update teacher
  const handleSaveTeacher = (teacher) => {
    if (!teacher.name || teacher.courses.length === 0 || !teacher.date) {
      return alert("Please fill all fields and select at least one course.");
    }

    if (teacher.id) {
      setTeachers(teachers.map(t => t.id === teacher.id ? teacher : t));
    } else {
      setTeachers([...teachers, { ...teacher, id: teachers.length + 1 }]);
    }
    setEditTeacher(null);
  };

  // Delete teacher
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-4 text-primary">Teachers & Courses</h3>

      {/* Search + Filter + Add */}
      <div className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="All">All Courses</option>
          {allCourses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          className="btn btn-primary ms-auto"
          onClick={() => setEditTeacher({ name: "", role: "Teacher", courses: [], date: "", videos: [""] })}
        >
          + Add Teacher
        </button>
      </div>

      {/* Cards */}
      <div className="row">
        {filteredTeachers.length > 0 ? filteredTeachers.map(t => (
          <div className="col-md-4 mb-4" key={t.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{t.name}</h5>
                <p className="card-text"><strong>Role:</strong> {t.role}</p>
                <p className="card-text"><strong>Courses:</strong> {t.courses.join(", ")}</p>
                <p className="card-text"><strong>Date Added:</strong> {t.date}</p>
                {t.videos.map((v, i) => (
                  <div className="ratio ratio-16x9 mb-2" key={i}>
                    <iframe src={v} title={`Video ${i}`} allowFullScreen></iframe>
                  </div>
                ))}
                <div className="mt-auto d-flex gap-2">
                  <button className="btn btn-sm btn-warning w-50" onClick={() => setEditTeacher(t)}>Edit</button>
                  <button className="btn btn-sm btn-danger w-50" onClick={() => handleDelete(t.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <p className="text-center">No teachers found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {editTeacher && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editTeacher.id ? "Edit Teacher" : "Add Teacher"}</h5>
                <button className="btn-close" onClick={() => setEditTeacher(null)}></button>
              </div>
              <div className="modal-body d-flex flex-column gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={editTeacher.name}
                  onChange={e => setEditTeacher({ ...editTeacher, name: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control"
                  value={editTeacher.date}
                  onChange={e => setEditTeacher({ ...editTeacher, date: e.target.value })}
                />
                <select
                  multiple
                  className="form-select"
                  value={editTeacher.courses}
                  onChange={e => setEditTeacher({
                    ...editTeacher,
                    courses: Array.from(e.target.selectedOptions, o => o.value)
                  })}
                >
                  {allCourses.map(c => <option key={c}>{c}</option>)}
                </select>
                {/* Videos input */}
                {editTeacher.videos.map((v, i) => (
                  <input
                    key={i}
                    type="text"
                    className="form-control"
                    placeholder={`Video URL ${i + 1}`}
                    value={v}
                    onChange={e => {
                      const newVideos = [...editTeacher.videos];
                      newVideos[i] = e.target.value;
                      setEditTeacher({ ...editTeacher, videos: newVideos });
                    }}
                  />
                ))}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditTeacher({ ...editTeacher, videos: [...editTeacher.videos, ""] })}
                >
                  + Add Courses
                </button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditTeacher(null)}>Cancel</button>
                <button className="btn btn-success" onClick={() => handleSaveTeacher(editTeacher)}>
                  {editTeacher.id ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherCoursesCards;
