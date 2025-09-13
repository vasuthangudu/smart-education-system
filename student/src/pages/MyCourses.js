// src/pages/Courses.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "http://localhost:5005/api"; // ✅ Updated URL

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [view, setView] = useState("card");
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      alert("Failed to fetch courses from server");
    } finally {
      setLoading(false);
    }
  };

  const uniqueSubjects = useMemo(() => {
    const subjects = [...new Set(courses.map((c) => c.subject))];
    return ["All", ...subjects];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        (department === "All" || c.department === department) &&
        c.subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, department, search]);

  const departmentSummary = useMemo(() => {
    const summary = {};
    courses.forEach((c) => {
      summary[c.department] = (summary[c.department] || 0) + c.videos.length;
    });
    return summary;
  }, [courses]);

  const subjectSummary = useMemo(() => {
    const summary = {};
    courses.forEach((c) => {
      if (subjectFilter === "All" || c.subject === subjectFilter) {
        summary[c.subject] = (summary[c.subject] || 0) + c.videos.length;
      }
    });
    return summary;
  }, [courses, subjectFilter]);

  return (
    <div className="container mt-3">
      <h4 className="mb-4 text-center fw-bold text-primary">
        🎥 Course Videos & Materials
      </h4>

      {/* Search + Department filter */}
      {view === "card" && (
        <div className="row mb-4 g-2 justify-content-center">
          <div className="col-md-5 col-sm-6">
            <input
              type="text"
              className="form-control form-control-sm shadow-sm rounded-pill"
              placeholder="🔍 Search by subject name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 col-sm-6">
            <select
              className="form-select form-select-sm shadow-sm rounded-pill"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {[...new Set(courses.map((c) => c.department))].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="text-center mb-4">
        <div className="btn-group">
          <button
            className={`btn btn-sm ${
              view === "card" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setView("card")}
          >
            🖼 Card View
          </button>
          <button
            className={`btn btn-sm ${
              view === "table" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setView("table")}
          >
            📊 Table View
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading courses...</p>
      ) : view === "table" ? (
        <>
          {/* Department-wise summary */}
          <div className="mb-5">
            <h5 className="text-secondary fw-bold mb-3">
              📋 Department-wise Videos
            </h5>
            <table className="table table-striped table-bordered table-sm shadow-sm">
              <thead className="table-primary">
                <tr>
                  <th>Department</th>
                  <th>Total Videos</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(departmentSummary).map(([dept, count]) => (
                  <tr key={dept}>
                    <td>{dept}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subject filter dropdown */}
          <div className="mb-3 d-flex justify-content-end">
            <select
              className="form-select form-select-sm w-auto shadow-sm rounded-pill"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              {uniqueSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Subject-wise summary */}
          <div className="mb-5">
            <h5 className="text-secondary fw-bold mb-3">
              📋 Subject-wise Videos
            </h5>
            <table className="table table-striped table-bordered table-sm shadow-sm">
              <thead className="table-success">
                <tr>
                  <th>Subject</th>
                  <th>Total Videos</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(subjectSummary).length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-muted">
                      ⚠️ No subjects found.
                    </td>
                  </tr>
                ) : (
                  Object.entries(subjectSummary).map(([subject, count]) => (
                    <tr key={subject}>
                      <td>{subject}</td>
                      <td>{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Card view with gradient hover effect
        <div className="row g-3">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-muted small">⚠️ No courses found.</p>
          ) : (
            filteredCourses.map((course) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3"
                key={course._id}
              >
                <div
                  className="card border-0 h-100 shadow-sm text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #6a11cb, #2575fc)",
                    transition: "transform 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div className="card-body p-2">
                    <h6 className="card-title fw-bold mb-1">
                      {course.subject}
                    </h6>
                    <p className="card-text small mb-2">
                      <span className="badge bg-warning text-dark me-1">
                        {course.department}
                      </span>
                      <span className="badge bg-info text-dark">
                        {course.faculty}
                      </span>
                    </p>
                    <h6 className="text-light small mb-1">🎬 Videos</h6>
                    {course.videos.map((v, idx) => (
                      <div className="ratio ratio-16x9 mb-2" key={idx}>
                        <iframe src={v.url} title={v.title} allowFullScreen></iframe>
                      </div>
                    ))}
                    <h6 className="text-light small mb-1">📂 Materials</h6>
                    <ul className="list-unstyled small mb-0">
                      {course.materials.map((m, idx) => (
                        <li key={idx}>
                          <a
                            href={`http://localhost:5005${m.url}`} // ✅ Updated URL
                            download
                            className="text-decoration-none text-warning"
                          >
                            📄 {m.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
