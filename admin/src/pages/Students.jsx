import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

export default function Students() {
  const [students, setStudents] = useState([
    { roll: "A25", name: "Ken Smith", department: "Science", email: "ken@gmail.com", phone: "(417) 646-7483", admissionDate: "2019-01-04" },
    { roll: "A26", name: "Gerald K Smith", department: "M.C.A.", email: "Gerald@gmail.com", phone: "(154) 646-2486", admissionDate: "2019-01-04" },
    { roll: "A25", name: "Ken Smith", department: "Mechanical", email: "ken@gmail.com", phone: "(417) 646-8377", admissionDate: "2019-01-04" },
    { roll: "A27", name: "Alice A Smith", department: "M.B.B.S.", email: "Patricia@gmail.com", phone: "(753) 646-4931", admissionDate: "2019-01-04" },
  ]);

  const [filters, setFilters] = useState({
    roll: "",
    name: "",
    department: "",
    admissionDate: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    roll: "",
    name: "",
    department: "",
    email: "",
    phone: "",
    admissionDate: "",
  });

  // Handle input change (filter)
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle input change (new student form)
  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  // Add new student
  const handleAddStudent = () => {
    if (
      newStudent.roll &&
      newStudent.name &&
      newStudent.department &&
      newStudent.email &&
      newStudent.phone &&
      newStudent.admissionDate
    ) {
      setStudents([...students, newStudent]);
      setShowModal(false);
      setNewStudent({
        roll: "",
        name: "",
        department: "",
        email: "",
        phone: "",
        admissionDate: "",
      });
    } else {
      alert("Please fill all fields!");
    }
  };

  // Apply filters
  const filteredStudents = students.filter(
    (s) =>
      (!filters.roll || s.roll.toLowerCase().includes(filters.roll.toLowerCase())) &&
      (!filters.name || s.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.department || s.department.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.admissionDate || s.admissionDate === filters.admissionDate)
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="mb-3 text-primary">Students</h3>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          ➕ Add Student
        </Button>
      </div>

      {/* Search Filters */}
      <div className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Roll No."
          name="roll"
          value={filters.roll}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          name="name"
          value={filters.name}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Department"
          name="department"
          value={filters.department}
          onChange={handleChange}
        />
        <input
          type="date"
          className="form-control"
          name="admissionDate"
          value={filters.admissionDate}
          onChange={handleChange}
        />
        <button className="btn btn-info text-white">Search</button>
      </div>

      {/* Student Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>ROLL NO.</th>
              <th>NAME</th>
              <th>DEPARTMENT</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>ADMISSION DATE</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={i}>
                <td>{s.roll}</td>
                <td className="d-flex align-items-center">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 1}`}
                    alt="profile"
                    className="rounded-circle me-2"
                  />
                  {s.name}
                </td>
                <td>{s.department}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>
                  {new Date(s.admissionDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Roll No.</Form.Label>
              <Form.Control type="text" name="roll" value={newStudent.roll} onChange={handleNewStudentChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={newStudent.name} onChange={handleNewStudentChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Department</Form.Label>
              <Form.Control type="text" name="department" value={newStudent.department} onChange={handleNewStudentChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={newStudent.email} onChange={handleNewStudentChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" value={newStudent.phone} onChange={handleNewStudentChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Admission Date</Form.Label>
              <Form.Control type="date" name="admissionDate" value={newStudent.admissionDate} onChange={handleNewStudentChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddStudent}>
            Save Student
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
