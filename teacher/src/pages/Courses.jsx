import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeVideos, setActiveVideos] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    id: null,
    subject: "",
    department: "",
    faculty: "",
    videos: [{ title: "", url: "" }],
    materials: [{ name: "", file: null }]
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("courses");
    if (saved) setCourses(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever courses changes
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (idx, field, value) => {
    const updated = [...form.videos];
    updated[idx][field] = value;
    setForm({ ...form, videos: updated });
  };

  const addVideo = () => setForm({ ...form, videos: [...form.videos, { title: "", url: "" }] });
  const removeVideo = (idx) =>
    setForm({ ...form, videos: form.videos.filter((_, i) => i !== idx) });

  const handleMaterialChange = (idx, file) => {
    const updated = [...form.materials];
    if (file) updated[idx] = { name: file.name, file };
    setForm({ ...form, materials: updated });
  };

  const addMaterial = () =>
    setForm({ ...form, materials: [...form.materials, { name: "", file: null }] });
  const removeMaterial = (idx) =>
    setForm({ ...form, materials: form.materials.filter((_, i) => i !== idx) });

  const resetForm = () => {
    setForm({
      id: null,
      subject: "",
      department: "",
      faculty: "",
      videos: [{ title: "", url: "" }],
      materials: [{ name: "", file: null }]
    });
    setEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.department || !form.faculty) {
      alert("Please fill all required fields");
      return;
    }

    const newCourse = { ...form, id: editMode ? form.id : Date.now() };

    if (editMode) {
      setCourses(courses.map((c) => (c.id === form.id ? newCourse : c)));
    } else {
      setCourses([...courses, newCourse]);
    }
    resetForm();
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const filteredCourses = courses.filter((c) =>
    [c.subject, c.department, c.faculty].some((f) =>
      f.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleVideos = (id) => setActiveVideos(activeVideos === id ? null : id);

  return (
    <div className="container my-4">
      <h4 className="text-primary fw-bold mb-3 text-center">📚 Manage Courses</h4>

      {/* Search */}
      <div className="mb-3 text-end">
        <input
          type="text"
          className="form-control form-control-sm d-inline-block"
          style={{ maxWidth: "300px" }}
          placeholder="🔍 Search by Subject/Dept/Faculty"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>{editMode ? "✏️ Edit Course" : "➕ Add Course"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  name="subject"
                  className="form-control form-control-sm"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="department"
                  className="form-control form-control-sm"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="faculty"
                  className="form-control form-control-sm"
                  placeholder="Faculty Name"
                  value={form.faculty}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Videos */}
            <h6 className="text-success">🎬 Videos</h6>
            {form.videos.map((v, idx) => (
              <div className="row g-2 mb-2" key={idx}>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="Video Title"
                    className="form-control form-control-sm"
                    value={v.title}
                    onChange={(e) => handleVideoChange(idx, "title", e.target.value)}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    placeholder="YouTube Embed URL"
                    className="form-control form-control-sm"
                    value={v.url}
                    onChange={(e) => handleVideoChange(idx, "url", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeVideo(idx)}
                    disabled={form.videos.length === 1}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-primary mb-3" onClick={addVideo}>
              ➕ Add Video
            </button>

            {/* Materials */}
            <h6 className="text-warning">📂 Materials (PDF)</h6>
            {form.materials.map((m, idx) => (
              <div className="row g-2 mb-2" key={idx}>
                <div className="col-md-8">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-control form-control-sm"
                    onChange={(e) => handleMaterialChange(idx, e.target.files[0])}
                  />
                  {m.name && <small className="text-success">Selected: {m.name}</small>}
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeMaterial(idx)}
                    disabled={form.materials.length === 1}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-sm btn-outline-primary mb-3"
              onClick={addMaterial}
            >
              ➕ Add Material
            </button>

            <div className="text-end">
              <button type="submit" className="btn btn-sm btn-success">
                {editMode ? "💾 Update" : "📥 Save"}
              </button>
              {editMode && (
                <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Courses Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>📋 Courses</h5>
          {filteredCourses.length === 0 ? (
            <p className="text-muted text-center">⚠️ No courses found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-striped">
                <thead className="table-primary">
                  <tr>
                    <th>Subject</th>
                    <th>Department</th>
                    <th>Faculty</th>
                    <th>Videos</th>
                    <th>Materials</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.subject}</td>
                      <td>{course.department}</td>
                      <td>{course.faculty}</td>
                      <td>{course.videos.length}</td>
                      <td>
                        {course.materials.map((m, i) => (
                          <div key={i}>{m.name}</div>
                        ))}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => toggleVideos(course.id)}
                        >
                          🎥 Videos
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => handleEdit(course)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(course.id)}
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Video Preview */}
      {activeVideos && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="text-success mb-3">🎬 Video Previews</h5>
            <div className="row">
              {courses
                .find((c) => c.id === activeVideos)
                ?.videos.map((v, idx) => (
                  <div className="col-md-4 mb-3" key={idx}>
                    <div className="card h-100 shadow-sm">
                      <iframe
                        width="100%"
                        height="200"
                        src={v.url}
                        title={v.title}
                        allowFullScreen
                      ></iframe>
                      <div className="card-body">
                        <h6>{v.title}</h6>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
