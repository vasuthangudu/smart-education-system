// src/Courses.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "http://localhost:5005/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeVideos, setActiveVideos] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    subject: "",
    department: "",
    faculty: "",
    videos: [{ title: "", url: "" }],
    materials: [],
    existingMaterials: [],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/courses`);
      setCourses(res.data);
    } catch {
      alert("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleVideoChange = (idx, field, value) => {
    const updated = [...form.videos];
    updated[idx][field] = value;
    setForm({ ...form, videos: updated });
  };

  const addVideo = () => setForm({ ...form, videos: [...form.videos, { title: "", url: "" }] });
  const removeVideo = (idx) => setForm({ ...form, videos: form.videos.filter((_, i) => i !== idx) });

  const handleMaterialChange = (e) => {
    const files = Array.from(e.target.files || []);
    setForm({ ...form, materials: [...form.materials, ...files] });
    e.target.value = null;
  };
  const removeNewMaterial = (i) =>
    setForm({ ...form, materials: form.materials.filter((_, idx) => idx !== i) });

  const handleExistingMaterialRemove = (fileName) => {
    setForm({
      ...form,
      existingMaterials: form.existingMaterials.filter((m) => m.fileName !== fileName),
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      subject: "",
      department: "",
      faculty: "",
      videos: [{ title: "", url: "" }],
      materials: [],
      existingMaterials: [],
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("subject", form.subject);
    fd.append("department", form.department);
    fd.append("faculty", form.faculty);
    fd.append("videos", JSON.stringify(form.videos));
    fd.append("existingMaterials", JSON.stringify(form.existingMaterials));
    form.materials.forEach((f) => fd.append("materials", f));

    try {
      if (editMode) {
        const res = await axios.put(`${API_BASE}/courses/${form.id}`, fd);
        setCourses(courses.map((c) => (c._id === form.id ? res.data : c)));
        alert("Course updated");
      } else {
        const res = await axios.post(`${API_BASE}/courses`, fd);
        setCourses([...courses, res.data]);
        alert("Course created");
      }
      resetForm();
    } catch {
      alert("Failed to save");
    }
  };

  const handleEdit = (c) => {
    setForm({
      id: c._id,
      subject: c.subject,
      department: c.department,
      faculty: c.faculty,
      videos: c.videos?.length ? c.videos : [{ title: "", url: "" }],
      materials: [],
      existingMaterials: c.materials || [],
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`${API_BASE}/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const toggleVideos = (id) => setActiveVideos(activeVideos === id ? null : id);

  const filtered = courses.filter((c) =>
    [c.subject, c.department, c.faculty].some((f) =>
      (f || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container py-4">
      <h4 className="text-primary text-center">📚 Manage Courses</h4>

      {/* Search */}
      <div className="mb-3 text-end">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search"
          className="form-control form-control-sm d-inline-block"
          style={{ maxWidth: "300px" }}
        />
      </div>

      {/* Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>{editMode ? "✏️ Edit Course" : "➕ Add Course"}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-2 mb-3">
              {["subject", "department", "faculty"].map((f, i) => (
                <div className="col-md-4" key={i}>
                  <input
                    name={f}
                    className="form-control form-control-sm"
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={form[f]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>

            {editMode && form.existingMaterials.length > 0 && (
              <div className="mb-2">
                <strong>Existing Materials:</strong>
                <ul>
                  {form.existingMaterials.map((m) => (
                    <li key={m.fileName}>
                      <a href={`http://localhost:5005${m.url}`} target="_blank" rel="noreferrer">
                        {m.name}
                      </a>{" "}
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-danger"
                        onClick={() => handleExistingMaterialRemove(m.fileName)}
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Videos */}
            <h6 className="text-success">🎬 Videos</h6>
            {form.videos.map((v, idx) => (
              <div className="row g-2 mb-2" key={idx}>
                <div className="col-md-5">
                  <input
                    placeholder="Video Title"
                    value={v.title}
                    className="form-control form-control-sm"
                    onChange={(e) => handleVideoChange(idx, "title", e.target.value)}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    placeholder="YouTube Embed URL"
                    value={v.url}
                    className="form-control form-control-sm"
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
            <button
              type="button"
              className="btn btn-sm btn-outline-primary mb-3"
              onClick={addVideo}
            >
              ➕ Add Video
            </button>

            {/* Materials */}
            <h6 className="text-warning">📂 Add Materials (PDF)</h6>
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="form-control form-control-sm"
              onChange={handleMaterialChange}
            />
            {form.materials.length > 0 && (
              <ul>
                {form.materials.map((f, i) => (
                  <li key={i}>
                    {f.name}
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-danger"
                      onClick={() => removeNewMaterial(i)}
                    >
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-end mt-2">
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

      {/* Course List */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>📋 Courses</h5>
          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
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
                  {filtered.map((c) => (
                    <tr key={c._id}>
                      <td>{c.subject}</td>
                      <td>{c.department}</td>
                      <td>{c.faculty}</td>
                      <td>{c.videos?.length || 0}</td>
                      <td>
                        {c.materials?.map((m, i) => (
                          <div key={i}>
                            <a href={`http://localhost:5005${m.url}`} target="_blank" rel="noreferrer">
                              {m.name}
                            </a>
                          </div>
                        ))}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => toggleVideos(c._id)}
                        >
                          🎥 Videos
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => handleEdit(c)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c._id)}
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

      {/* Video Previews */}
      {activeVideos && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="text-success mb-3">🎬 Video Previews</h5>
            <div className="row">
              {courses
                .find((c) => c._id === activeVideos)
                ?.videos?.map((v, idx) => (
                  <div className="col-md-4 mb-3" key={idx}>
                    <div className="card h-100 shadow-sm">
                      <div style={{ position: "relative", paddingTop: "56.25%" }}>
                        <iframe
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                          src={v.url}
                          title={v.title || `video-${idx}`}
                          allowFullScreen
                        ></iframe>
                      </div>
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
