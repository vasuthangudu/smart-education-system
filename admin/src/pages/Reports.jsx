import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// Single-file Admin Reports + Users management component
// - Replace mock data / stubbed API calls with your real backend endpoints
// - Requires: react-chartjs-2, chart.js, jspdf, jspdf-autotable, bootstrap

export default function AdminReports() {
  // ------------------------- Mock / Initial Data -------------------------
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", role: "Student", email: "alice@mail.com", class: "A" },
    { id: 2, name: "Bob Smith", role: "Teacher", email: "bob@mail.com", class: "-" },
    { id: 3, name: "Charlie Brown", role: "Admin", email: "charlie@mail.com", class: "-" },
    { id: 4, name: "David Miller", role: "Student", email: "david@mail.com", class: "B" },
    { id: 5, name: "Emma Wilson", role: "Student", email: "emma@mail.com", class: "A" },
  ]);

  const [courses] = useState([
    { id: 1, title: "Math 101", enrolled: 45 },
    { id: 2, title: "Physics 101", enrolled: 30 },
    { id: 3, title: "Chemistry 101", enrolled: 28 },
  ]);

  const [exams] = useState([
    { id: 1, title: "Midterm - Math", avg: 68, highest: 98, lowest: 20, pass: 80, total: 100 },
    { id: 2, title: "Final - Physics", avg: 72, highest: 95, lowest: 25, pass: 85, total: 100 },
  ]);

  // Attendance mock: map of date -> { classA: %, classB: % }
  const [attendance] = useState([
    { date: "2025-09-01", A: 92, B: 88 },
    { date: "2025-09-02", A: 90, B: 85 },
    { date: "2025-09-03", A: 94, B: 91 },
    { date: "2025-09-04", A: 86, B: 80 },
    { date: "2025-09-05", A: 88, B: 82 },
  ]);

  // ------------------------- UI State -------------------------
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Add / Edit user state
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student", class: "A" });
  const [editUser, setEditUser] = useState(null);

  // Pagination for tables
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Scheduled reports (saved locally as mock)
  const [schedules, setSchedules] = useState(() => {
    try {
      const raw = localStorage.getItem("schedules");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Saved report templates
  const [templates, setTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem("reportTemplates");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Mock current user role for access control
  const currentUserRole = "SuperAdmin"; // change to "Admin" / "Viewer" to test

  // ------------------------- Derived values -------------------------
  const roleCounts = useMemo(() => ({
    Students: users.filter((u) => u.role === "Student").length,
    Teachers: users.filter((u) => u.role === "Teacher").length,
    Admins: users.filter((u) => u.role === "Admin").length,
  }), [users]);

  const totalCourses = courses.length;
  const totalExams = exams.length;

  const passFail = useMemo(() => {
    // simplified overall pass/fail from exams mock
    const totalPass = exams.reduce((s, e) => s + e.pass, 0);
    const totalPossible = exams.reduce((s, e) => s + e.total, 0);
    const passRatio = totalPossible === 0 ? 0 : Math.round((totalPass / totalPossible) * 100);
    return { passPercent: passRatio, failPercent: 100 - passRatio };
  }, [exams]);

  const attendancePercent = useMemo(() => {
    if (!attendance.length) return 0;
    const total = attendance.reduce((s, a) => s + a.A + a.B, 0);
    const count = attendance.length * 2;
    return Math.round(total / count);
  }, [attendance]);

  // Filtered users for table
  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "All" || u.role === filterRole;
    const matchesClass = filterClass === "All" || u.class === filterClass;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesClass && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  // ------------------------- CRUD Handlers -------------------------
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return alert("Please fill all fields");
    const id = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setUsers((prev) => [...prev, { id, ...newUser }]);
    setNewUser({ name: "", email: "", role: "Student", class: "A" });
  };

  const handleEditUserSave = (id) => {
    if (!editUser) return;
    setUsers((prev) => prev.map((u) => (u.id === id ? editUser : u)));
    setEditUser(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // ------------------------- Export Helpers -------------------------
  const exportCSV = (rows, filename = "report.csv") => {
    if (!rows || !rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(";"), ...rows.map((r) => keys.map((k) => `"${(r[k] ?? "").toString().replace(/"/g, '""')}"`).join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const exportPDF = (title, rows) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 20);
    const columns = Object.keys(rows[0] || {}).map((k) => ({ header: k, dataKey: k }));
    doc.autoTable({ startY: 28, head: [columns.map((c) => c.header)], body: rows.map((r) => Object.values(r)) });
    doc.save(`${title}.pdf`);
  };

  // ------------------------- Charts Data -------------------------
  const studentCountPerClass = useMemo(() => {
    const classes = Array.from(new Set(users.filter((u) => u.class && u.class !== "-").map((u) => u.class)));
    const data = classes.map((c) => users.filter((u) => u.class === c && u.role === "Student").length);
    return { labels: classes, datasets: [{ label: "Students", data }] };
  }, [users]);

  const attendanceLineData = useMemo(() => {
    return {
      labels: attendance.map((a) => a.date),
      datasets: [
        { label: "Class A", data: attendance.map((a) => a.A), fill: false, tension: 0.3 },
        { label: "Class B", data: attendance.map((a) => a.B), fill: false, tension: 0.3 },
      ],
    };
  }, [attendance]);

  const examPieData = useMemo(() => {
    return {
      labels: exams.map((e) => e.title),
      datasets: [{ data: exams.map((e) => e.avg) }],
    };
  }, [exams]);

  // ------------------------- Schedules & Templates -------------------------
  const addSchedule = (name, cronOrWhen) => {
    const s = { id: Date.now(), name, when: cronOrWhen };
    const next = [...schedules, s];
    setSchedules(next);
    localStorage.setItem("schedules", JSON.stringify(next));
    alert("Schedule saved (mock). In production call backend to actually schedule emails/reports.");
  };

  const saveTemplate = (name, settings) => {
    const t = { id: Date.now(), name, settings };
    const next = [...templates, t];
    setTemplates(next);
    localStorage.setItem("reportTemplates", JSON.stringify(next));
    alert("Template saved locally.");
  };

  // ------------------------- Small helpers -------------------------
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]);

  const classesOptions = useMemo(() => ["All", ...Array.from(new Set(users.map((u) => u.class))).filter((c) => c && c !== "-")], [users]);

  // ------------------------- Render -------------------------
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary">Admin Reports & Users</h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => exportCSV(users, "users.csv")}>
            <i className="bi bi-download"></i> Export Users CSV
          </button>
          <button className="btn btn-outline-secondary" onClick={() => exportPDF("Users Report", users.map(u => ({ ID: u.id, Name: u.name, Email: u.email, Role: u.role, Class: u.class })))}>
            <i className="bi bi-file-earmark-pdf"></i> Export Users PDF
          </button>
        </div>
      </div>

      <div className="card p-3 shadow-sm mb-3">
        <div className="row gx-2">
          <div className="col-md-2">
            <div className="card p-2 text-center">
              <small className="text-muted">Total Students</small>
              <h5 className="m-0">{roleCounts.Students}</h5>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card p-2 text-center">
              <small className="text-muted">Total Teachers</small>
              <h5 className="m-0">{roleCounts.Teachers}</h5>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card p-2 text-center">
              <small className="text-muted">Total Courses</small>
              <h5 className="m-0">{totalCourses}</h5>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card p-2 text-center">
              <small className="text-muted">Total Exams</small>
              <h5 className="m-0">{totalExams}</h5>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card p-2 text-center">
              <small className="text-muted">Pass%</small>
              <h5 className="m-0">{passFail.passPercent}%</h5>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card p-2 text-center">
              <small className="text-muted">Attendance</small>
              <h5 className="m-0">{attendancePercent}%</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="card p-3 mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-3">
            <input className="form-control" placeholder="Search by name/email" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option>All</option>
              <option>Student</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              {classesOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="col-md-1 text-end">
            <button className="btn btn-primary" onClick={() => { setPage(1); }}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h6>Students per Class</h6>
            <Bar data={studentCountPerClass} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 h-100">
            <h6>Attendance Trend</h6>
            <Line data={attendanceLineData} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 h-100 mt-3">
            <h6>Exam Averages</h6>
            <Pie data={examPieData} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 h-100 mt-3">
            <h6>Quick Insights</h6>
            <ul>
              <li>Top course by enrollment: {courses.reduce((a,b)=> a.enrolled>b.enrolled?a:b).title}</li>
              <li>Avg attendance: {attendancePercent}%</li>
              <li>Latest exam avg: {exams[0]?.avg ?? "N/A"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-3 mb-3">
        <h5>Users</h5>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.slice((page - 1) * pageSize, page * pageSize).map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <input className="form-control" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <input className="form-control" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <select className="form-select" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                      <option>Student</option>
                      <option>Teacher</option>
                      <option>Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <input className="form-control" value={editUser.class} onChange={(e) => setEditUser({ ...editUser, class: e.target.value })} />
                  ) : (
                    user.class || "-"
                  )}
                </td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleEditUserSave(user.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditUser(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => setEditUser(user)}><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteUser(user.id)}><i className="bi bi-trash"></i></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            Showing {Math.min((page - 1) * pageSize + 1, filteredUsers.length)} to {Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length}
          </div>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
            <span>Page {page} / {totalPages}</span>
            <button className="btn btn-sm btn-outline-secondary ms-2" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>

      </div>

      {/* Add user form */}
      <div className="card p-3 mb-3">
        <h5>Add New User</h5>
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input className="form-control" placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option>Student</option>
              <option>Teacher</option>
              <option>Admin</option>
            </select>
          </div>
          <div className="col-md-2">
            <input className="form-control" placeholder="Class (A/B)" value={newUser.class} onChange={(e) => setNewUser({ ...newUser, class: e.target.value })} />
          </div>
          <div className="col-md-1 text-end">
            <button className="btn btn-primary" onClick={handleAddUser}>Add</button>
          </div>
        </div>
      </div>

      {/* Schedules & Templates (Advanced Features UI) */}
      <div className="card p-3 mb-3">
        <h5>Scheduled Reports (mock)</h5>
        <div className="row g-2 align-items-center mb-2">
          <div className="col-md-4">
            <input id="schedName" className="form-control" placeholder="Report name (eg. Weekly Attendance)" />
          </div>
          <div className="col-md-4">
            <input id="schedWhen" className="form-control" placeholder="When (cron or human text)" />
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-primary" onClick={() => addSchedule(document.getElementById("schedName").value, document.getElementById("schedWhen").value)}>Save Schedule</button>
          </div>
        </div>
        <div>
          {schedules.length === 0 ? <small className="text-muted">No schedules saved (mock - backend required for real scheduling)</small> : (
            <ul>
              {schedules.map(s => <li key={s.id}>{s.name} — {s.when}</li>)}
            </ul>
          )}
        </div>

        <hr />
        <h6>Save Report Template</h6>
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <input id="templateName" className="form-control" placeholder="Template name" />
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-success" onClick={() => saveTemplate(document.getElementById("templateName").value, { search, filterRole, filterClass, dateFrom, dateTo })}>Save Template</button>
          </div>
        </div>
        <div className="mt-2">
          {templates.length === 0 ? <small className="text-muted">No templates saved</small> : (
            <ul>
              {templates.map(t => <li key={t.id}><strong>{t.name}</strong> — <small className="text-muted">{JSON.stringify(t.settings)}</small></li>)}
            </ul>
          )}
        </div>
      </div>

      {/* System Activity (sensitive) */}
      {currentUserRole === "SuperAdmin" ? (
        <div className="card p-3 mb-5">
          <h5>System Activity (last 24 hrs)</h5>
          <ul>
            <li>[09:00] Student login: alice@mail.com</li>
            <li>[10:22] New course added: Advanced AI</li>
            <li>[11:11] Exam created: Final - Chemistry</li>
            <li>[12:05] Error: Failed to generate report (mock)</li>
          </ul>
        </div>
      ) : null}

    </div>
  );
}
