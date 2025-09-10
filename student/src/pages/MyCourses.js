import React, { useState, useMemo } from "react";
import coursesData from "../data/courses.json";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [view, setView] = useState("card");
  const [subjectFilter, setSubjectFilter] = useState("All");

  // Get unique subjects for dropdown
  const uniqueSubjects = useMemo(() => {
    const subjects = [...new Set(coursesData.map((c) => c.subject))];
    return ["All", ...subjects];
  }, []);

  // Filter courses for card view
  const filteredCourses = useMemo(() => {
    return coursesData.filter(
      (c) =>
        (department === "All" || c.department === department) &&
        c.subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [department, search]);

  // Department-wise video summary
  const departmentSummary = useMemo(() => {
    const summary = {};
    coursesData.forEach((c) => {
      summary[c.department] = (summary[c.department] || 0) + c.videos.length;
    });
    return summary;
  }, []);

  // Subject-wise video summary (with dropdown filter)
  const subjectSummary = useMemo(() => {
    const summary = {};
    coursesData.forEach((c) => {
      if (subjectFilter === "All" || c.subject === subjectFilter) {
        summary[c.subject] = (summary[c.subject] || 0) + c.videos.length;
      }
    });
    return summary;
  }, [subjectFilter]);

  return (
    <div className="container mt-3">
      <h4 className="mb-4 text-primary fw-bold text-center">
        🎥 Course Videos & Materials
      </h4>

      {/* Search + Filter for card view */}
      {view === "card" && (
        <div className="row mb-4 g-2 justify-content-center">
          <div className="col-md-5 col-sm-6">
            <input
              type="text"
              className="form-control form-control-sm shadow-sm"
              placeholder="🔍 Search by subject name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4 col-sm-6">
            <select
              className="form-select form-select-sm shadow-sm"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Management">Management</option>
              <option value="Mathematics">Mathematics</option>
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

      {view === "table" ? (
        <>
          {/* Department-wise summary table */}
          <div className="mb-5">
            <h5 className="text-secondary fw-bold mb-3">📋 Department-wise Videos</h5>
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

          {/* Subject dropdown for filtering */}
          <div className="mb-3 d-flex justify-content-end">
            <select
              className="form-select form-select-sm w-auto shadow-sm"
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

          {/* Subject-wise summary table */}
          <div className="mb-5">
            <h5 className="text-secondary fw-bold mb-3">📋 Subject-wise Videos</h5>
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
        <div className="row g-3">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-muted small">⚠️ No courses found.</p>
          ) : (
            filteredCourses.map((course) => (
              <div className="col-md-6 col-lg-4" key={course.id}>
                <div className="card shadow-sm border-0 h-100">
                  {course.image && (
                    <img
                      src={course.image}
                      className="card-img-top"
                      alt={course.subject}
                      style={{
                        height: "130px",
                        objectFit: "cover",
                        borderTopLeftRadius: "0.5rem",
                        borderTopRightRadius: "0.5rem",
                      }}
                    />
                  )}
                  <div className="card-body p-2">
                    <h6 className="card-title fw-bold mb-1">{course.subject}</h6>
                    <p className="card-text text-muted small mb-2">
                      <strong>Dept:</strong> {course.department} <br />
                      <strong>Faculty:</strong> {course.faculty}
                    </p>
                    <h6 className="text-success small mb-1">🎬 Videos</h6>
                    {course.videos.slice(0, 1).map((v, idx) => (
                      <div className="ratio ratio-16x9 mb-2" key={idx}>
                        <iframe src={v.url} title={v.title} allowFullScreen></iframe>
                      </div>
                    ))}
                    <h6 className="text-warning small mb-1">📂 Materials</h6>
                    <ul className="list-unstyled small mb-0">
                      {course.materials.slice(0, 2).map((m, idx) => (
                        <li key={idx}>
                          <a href={`/${m}`} download className="text-decoration-none">
                            📄 {m}
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
