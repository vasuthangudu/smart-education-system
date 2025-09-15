import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = "http://localhost:5005/api/courses";

export default function CoursesUI() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCourse, setEditCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const fetchCourses = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this course?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        setCourses(courses.filter((c) => c._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveCourse = async (course, files) => {
    if (!course.subject || !course.department || !course.faculty)
      return alert("Please fill all required fields.");
    const formData = new FormData();
    formData.append("subject", course.subject);
    formData.append("department", course.department);
    formData.append("faculty", course.faculty);
    formData.append("videos", JSON.stringify(course.videos || []));
    if (files) {
      for (let file of files) formData.append("materials", file);
    }
    if (course.materials)
      formData.append("existingMaterials", JSON.stringify(course.materials));
    try {
      let res;
      if (course._id) {
        res = await axios.put(`${BASE_URL}/${course._id}`, formData);
        setCourses(
          courses.map((c) => (c._id === course._id ? res.data : c))
        );
      } else {
        res = await axios.post(BASE_URL, formData);
        setCourses([res.data, ...courses]);
      }
      setEditCourse(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container my-4">
      <h2
        className="text-center mb-4 fw-bold text-light p-3 rounded shadow"
        style={{
          background:
            "linear-gradient(135deg, #4e54c8, #8f94fb)",
          fontFamily: "'Poppins', sans-serif",
          textShadow: "1px 1px 4px #000",
        }}
      >
        🎓 Courses 
      </h2>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🔍 Search by subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-gradient ms-auto shadow"
          onClick={() =>
            setEditCourse({
              subject: "",
              department: "",
              faculty: "",
              videos: [],
              materials: [],
            })
          }
          style={{
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            color: "#fff",
            borderRadius: "25px",
            fontWeight: "600",
          }}
        >
          + Add Course
        </button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle shadow-sm">
              <thead
                style={{
                  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                  color: "#fff",
                  textShadow: "1px 1px 3px #000",
                }}
              >
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
                {paginatedCourses.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No courses found.
                    </td>
                  </tr>
                )}
                {paginatedCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover-shadow-sm"
                    style={{
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <td className="fw-bold">{course.subject}</td>
                    <td>{course.department}</td>
                    <td>{course.faculty}</td>
                    <td>
                      {course.videos?.map((v, i) => (
                        <a
                          key={i}
                          href={v.url}
                          target="_blank"
                          rel="noreferrer"
                          className="d-block text-decoration-none text-primary"
                        >
                          ▶ {v.title || `Video ${i + 1}`}
                        </a>
                      ))}
                    </td>
                    <td>
                      {course.materials?.map((m, i) => (
                        <a
                          key={i}
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="d-block text-decoration-none text-success"
                        >
                          📄 {m.name}
                        </a>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => setEditCourse(course)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(course._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-outline-primary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ⬅ Prev
            </button>
            <span className="align-self-center fw-bold">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ➡
            </button>
          </div>
        </>
      )}

      {editCourse && (
        <CourseModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
}

function CourseModal({ course, onClose, onSave }) {
  const [localCourse, setLocalCourse] = useState(course);
  const [files, setFiles] = useState([]);
  const handleFileChange = (e) => setFiles([...e.target.files]);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-3">
          <div
            className="modal-header text-white"
            style={{
              background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            }}
          >
            <h5 className="modal-title fw-bold">
              {course._id ? "Edit Course" : "Add Course"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body d-flex flex-column gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Subject"
              value={localCourse.subject}
              onChange={(e) =>
                setLocalCourse({ ...localCourse, subject: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Department"
              value={localCourse.department}
              onChange={(e) =>
                setLocalCourse({ ...localCourse, department: e.target.value })
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Faculty"
              value={localCourse.faculty}
              onChange={(e) =>
                setLocalCourse({ ...localCourse, faculty: e.target.value })
              }
            />
            {localCourse.videos?.map((v, i) => (
              <input
                key={i}
                type="text"
                className="form-control"
                placeholder={`Video URL ${i + 1}`}
                value={v.url || v}
                onChange={(e) => {
                  const updated = [...localCourse.videos];
                  updated[i] = { title: `Video ${i + 1}`, url: e.target.value };
                  setLocalCourse({ ...localCourse, videos: updated });
                }}
              />
            ))}
            <button
              className="btn btn-sm btn-secondary"
              onClick={() =>
                setLocalCourse({
                  ...localCourse,
                  videos: [...localCourse.videos, { title: "", url: "" }],
                })
              }
            >
              + Add Video
            </button>
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleFileChange}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={() => onSave(localCourse, files)}
            >
              {course._id ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
