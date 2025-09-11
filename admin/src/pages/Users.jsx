import React, { useState, useMemo } from "react";
import { Tabs, Tab, Button, Table, Form, Row, Col, Card } from "react-bootstrap";
import adminsData from "../data/admins.json";
import teachersData from "../data/teachers.json";
import studentsData from "../data/students.json";

function Users() {
  const [users, setUsers] = useState({
    admin: adminsData,
    teacher: teachersData,
    student: studentsData,
  });

  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterReg, setFilterReg] = useState("");

  // --- Empty templates for mapping inputs
  const emptyStudent = {
    name: "",
    fatherName: "",
    email: "",
    Password: "",
    dob: "",
    gender: "",
    nationality: "",
    religion: "",
    emergencyContact: "",
    admissionNumber: "",
    applicationNumber: "",
    feeCategory: "",
    dateOfAdmission: "",
    userId: "",
    class: "",
    semester: "",
    eligibilityNumber: "",
    localAddress: "",
    permanentAddress: "",
    city: "",
    state: "",
    zipCode: "",
    department: "",
    section: "",
  };

  const emptyTeacher = {
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    avatar: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    employeeId: "",
    department: "",
    subjectSpecialization: "",
    qualification: "",
    experienceYears: "",
    joiningDate: "",
    position: "",
    classesAssigned: "",
    isActive: true,
    role: "Teacher",
  };

  const emptyAdmin = {
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Admin",
    employeeId: "",
    department: "",
    joiningDate: "",
  };

  // --- Generic submit handler for admin/teacher/student
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updated = { ...users };

    if (activeTab === "student") {
      if (editingItem) {
        updated.student = updated.student.map((s) =>
          s.id === editingItem.id ? { ...formData, id: s.id } : s
        );
      } else {
        const newId = (updated.student?.length || 0) + 1;
        updated.student = [...(updated.student || []), { ...formData, id: newId }];
      }
    } else if (activeTab === "teacher") {
      if (editingItem) {
        updated.teacher = updated.teacher.map((t) =>
          t.id === editingItem.id ? { ...formData, id: t.id } : t
        );
      } else {
        const newId = (updated.teacher?.length || 0) + 1;
        updated.teacher = [...(updated.teacher || []), { ...formData, id: newId }];
      }
    } else if (activeTab === "admin") {
      if (editingItem) {
        updated.admin = updated.admin.map((a) =>
          a.id === editingItem.id ? { ...formData, id: a.id } : a
        );
      } else {
        const newId = (updated.admin?.length || 0) + 1;
        updated.admin = [...(updated.admin || []), { ...formData, id: newId }];
      }
    }

    setUsers(updated);
    // reset form state based on current tab
    setFormData({});
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
  };

  const handleDeleteUser = (id) => {
    const updated = { ...users };
    if (activeTab === "student") {
      updated.student = updated.student.filter((s) => s.id !== id);
    } else if (activeTab === "teacher") {
      updated.teacher = updated.teacher.filter((t) => t.id !== id);
    } else if (activeTab === "admin") {
      updated.admin = updated.admin.filter((a) => a.id !== id);
    }
    setUsers(updated);
  };

  // --- Filters + computed lists
  const filteredStudents = useMemo(() => {
    return (users.student || []).filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.userId?.toLowerCase().includes(q) ||
        s.admissionNumber?.toLowerCase().includes(q);
      const matchesDept = filterDept ? s.department === filterDept : true;
      const matchesClass = filterClass ? s.class === filterClass : true;
      const matchesReg = filterReg ? s.admissionNumber === filterReg : true;
      return matchesSearch && matchesDept && matchesClass && matchesReg;
    });
  }, [users.student, searchQuery, filterDept, filterClass, filterReg]);

  const filteredTeachers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (users.teacher || []).filter((t) => !q || t.name?.toLowerCase().includes(q));
  }, [users.teacher, searchQuery]);

  const filteredAdmins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (users.admin || []).filter(
      (a) =>
        !q ||
        a.fullName?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.employeeId?.toLowerCase().includes(q)
    );
  }, [users.admin, searchQuery]);

  // --- Counts
  const totalStudents = filteredStudents.length;

  const deptCounts = useMemo(() => {
    return (users.student || []).reduce((acc, s) => {
      const d = s.department || "Unknown";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
  }, [users.student]);

  const classSectionCounts = useMemo(() => {
    return (users.student || []).reduce((acc, s) => {
      const key = `${s.class || "Unknown"}-${s.section || "A"}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [users.student]);

  const totalAdmins = (users.admin || []).length;

  // --- UI render
  return (
    <div className="p-3">
      <h4 className="text-primary mb-3">Users Management</h4>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setFormData({});
          setEditingItem(null);
          setSearchQuery("");
        }}
      >
        <Tab eventKey="admin" title="Admins" />
        <Tab eventKey="teacher" title="Teachers" />
        <Tab eventKey="student" title="Students" />
      </Tabs>

      {/* Search + filters row */}
      <Row className="mt-3 g-2">
        <Col md={3}>
          <Form.Control
            placeholder="Search by name, ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>

        {activeTab === "student" && (
          <>
            <Col md={3}>
              <Form.Control
                placeholder="Filter by Department"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Filter by Class"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                placeholder="Filter by Admission Number"
                value={filterReg}
                onChange={(e) => setFilterReg(e.target.value)}
              />
            </Col>
          </>
        )}
      </Row>

      {/* Student summary cards */}
      {activeTab === "student" && (
        <>
          <Row className="mt-4 g-3">
            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <Card.Title className="text-muted small">Total Students</Card.Title>
                  <h3 className="text-primary">{totalStudents}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-muted small">Department Counts</Card.Title>
                  {Object.keys(deptCounts).length === 0 ? (
                    <div className="text-muted">No data</div>
                  ) : (
                    Object.entries(deptCounts).map(([dept, count]) => (
                      <div key={dept} className="d-flex justify-content-between">
                        <div>{dept}</div>
                        <div className="fw-bold">{count}</div>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-muted small">Class-Section Counts</Card.Title>
                  {Object.keys(classSectionCounts).length === 0 ? (
                    <div className="text-muted">No data</div>
                  ) : (
                    Object.entries(classSectionCounts).map(([cls, count]) => (
                      <div key={cls} className="d-flex justify-content-between">
                        <div>{cls}</div>
                        <div className="fw-bold">{count}</div>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Admin summary card */}
      {activeTab === "admin" && (
        <Row className="mt-4">
          <Col md={4}>
            <Card className="shadow-sm text-center p-3">
              <h6 className="text-muted">Total Admins</h6>
              <h3 className="text-primary">{totalAdmins}</h3>
            </Card>
          </Col>
        </Row>
      )}

      {/* Forms + lists */}
      {activeTab === "admin" && (
        <>
          <h5 className="mt-4">{editingItem ? "Edit Admin" : "Add New Admin"}</h5>

          <Form onSubmit={handleFormSubmit} className="border p-3 rounded bg-light">
            <Row>
              {Object.keys(emptyAdmin).map((key) => (
                <Col md={4} className="mb-2" key={key}>
                  <Form.Label className="text-capitalize">{key.replace(/([A-Z])/g, " $1")}</Form.Label>
                  <Form.Control
                    type={key === "password" ? "password" : "text"}
                    value={formData[key] || ""}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </Col>
              ))}
            </Row>
            <Button type="submit" className="mt-2">
              {editingItem ? "Update Admin" : "Add Admin"}
            </Button>
          </Form>

          <h5 className="mt-4">Admins List</h5>
          <Table striped bordered hover responsive className="mt-2">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.fullName}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.employeeId}</td>
                  <td>{a.department}</td>
                  <td>
                    <Button size="sm" variant="info" className="me-2" onClick={() => handleEdit(a)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteUser(a.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Teacher form & list */}
      {activeTab === "teacher" && (
        <>
          <h5 className="mt-4">{editingItem ? "Edit Teacher" : "Add New Teacher"}</h5>

          <Form onSubmit={handleFormSubmit} className="border p-3 rounded bg-light">
            <Row>
              {Object.keys(emptyTeacher).map((key) => (
                <Col md={4} className="mb-2" key={key}>
                  <Form.Label className="text-capitalize">{key.replace(/([A-Z])/g, " $1")}</Form.Label>
                  <Form.Control
                    type={key === "password" ? "password" : "text"}
                    value={formData[key] || ""}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </Col>
              ))}
            </Row>
            <Button type="submit" className="mt-2">
              {editingItem ? "Update Teacher" : "Add Teacher"}
            </Button>
          </Form>

          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.department}</td>
                  <td>{t.position}</td>
                  <td>
                    <Button size="sm" variant="info" className="me-2" onClick={() => handleEdit(t)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteUser(t.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Student form & list */}
      {activeTab === "student" && (
        <>
          <h5 className="mt-4">{editingItem ? "Edit Student" : "Add New Student"}</h5>
          <Form onSubmit={handleFormSubmit} className="border p-3 rounded bg-light">
            <Row>
              {Object.keys(emptyStudent).map((key) => (
                <Col md={4} className="mb-2" key={key}>
                  <Form.Label className="text-capitalize">{key.replace(/([A-Z])/g, " $1")}</Form.Label>
                  <Form.Control
                    type={key === "Password" ? "password" : key === "dob" || key === "dateOfAdmission" ? "date" : "text"}
                    value={formData[key] || ""}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </Col>
              ))}
            </Row>
            <Button type="submit" className="mt-2">
              {editingItem ? "Update Student" : "Add Student"}
            </Button>
          </Form>

          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>User ID</th>
                <th>Department</th>
                <th>Class</th>
                <th>Admission #</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.userId}</td>
                  <td>{s.department}</td>
                  <td>{s.class}</td>
                  <td>{s.admissionNumber}</td>
                  <td>
                    <Button size="sm" variant="info" className="me-2" onClick={() => handleEdit(s)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteUser(s.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

export default Users;
