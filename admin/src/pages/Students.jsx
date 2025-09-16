import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

export default function Students() {
  const initialStudents = [
    { roll: "A25", name: "Ken Smith", department: "Science", email: "ken@gmail.com", phone: "(417)646-7483", admissionDate: "2019-01-04" },
    { roll: "A26", name: "Gerald K Smith", department: "M.C.A.", email: "gerald@gmail.com", phone: "(154)646-2486", admissionDate: "2019-01-04" },
    { roll: "A27", name: "Alice A Smith", department: "M.B.B.S.", email: "alice@gmail.com", phone: "(753)646-4931", admissionDate: "2019-01-04" },
    { roll: "A28", name: "John Doe", department: "Mechanical", email: "john@gmail.com", phone: "(417)646-8377", admissionDate: "2020-05-10" },
    { roll: "A29", name: "Mary Jane", department: "Biology", email: "mary@gmail.com", phone: "(417)123-4567", admissionDate: "2021-02-20" },
    { roll: "A30", name: "Chris Paul", department: "Chemistry", email: "chris@gmail.com", phone: "(417)222-3333", admissionDate: "2022-06-15" },
    { roll: "A31", name: "Lisa Ray", department: "Physics", email: "lisa@gmail.com", phone: "(417)444-5555", admissionDate: "2021-08-25" },
    { roll: "A32", name: "David Miller", department: "IT", email: "david@gmail.com", phone: "(417)777-8888", admissionDate: "2023-03-18" },
    { roll: "A33", name: "Sophia Lee", department: "Math", email: "sophia@gmail.com", phone: "(417)999-0000", admissionDate: "2023-04-10" },
    { roll: "A34", name: "Paul Walker", department: "Arts", email: "paul@gmail.com", phone: "(417)111-2222", admissionDate: "2023-07-01" },
    { roll: "A35", name: "Emma Stone", department: "Science", email: "emma@gmail.com", phone: "(417)333-4444", admissionDate: "2024-01-12" },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    roll: "", name: "", department: "", email: "", phone: "", admissionDate: "",
  });
  const [page, setPage] = useState(1);

  const handleNewStudentChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = () => {
    if (Object.values(newStudent).some((val) => val === "")) {
      alert("Please fill all fields!");
      return;
    }
    setStudents([...students, newStudent]);
    setShowModal(false);
    setNewStudent({ roll: "", name: "", department: "", email: "", phone: "", admissionDate: "" });
  };

  const perPage = 10;
  const startIndex = (page - 1) * perPage;
  const currentStudents = students.slice(startIndex, startIndex + perPage);

  return (
    <div className="container mt-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        body { font-family: 'Poppins', sans-serif; }
        .gradient-header { background: linear-gradient(45deg,#6a11cb,#2575fc); color:#fff; }
        .btn-3d {
          background: linear-gradient(145deg,#6a11cb,#2575fc);
          border:none;
          color:white;
          box-shadow:0 4px 6px rgba(0,0,0,0.2);
          transition:transform .2s, box-shadow .2s;
        }
        .btn-3d:hover { transform:translateY(-2px); box-shadow:0 8px 12px rgba(0,0,0,0.3); }
        table tbody tr:hover { transform:scale(1.01); transition:.2s; box-shadow:0 2px 8px rgba(0,0,0,0.1);}
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="gradient-header p-2 rounded">🎓 Students</h3>
        <Button className="btn-3d" onClick={() => setShowModal(true)}>➕ Add Student</Button>
      </div>

      <div className="table-responsive shadow rounded">
        <table className="table table-hover align-middle text-center">
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
            {currentStudents.map((s, i) => (
              <tr key={i}>
                <td>{s.roll}</td>
                <td className="d-flex align-items-center">
                  <img src={`https://i.pravatar.cc/40?img=${i + 1}`} alt="profile"
                    className="rounded-circle me-2" />
                  {s.name}
                </td>
                <td>{s.department}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{new Date(s.admissionDate).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric"
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {page * perPage < students.length && (
        <div className="text-center mt-3">
          <Button className="btn-3d" onClick={() => setPage(page + 1)}>Next ➡️</Button>
        </div>
      )}

      {/* Add Student Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="gradient-header">
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["roll","name","department","email","phone","admissionDate"].map((field) => (
              <Form.Group className="mb-2" key={field}>
                <Form.Label className="fw-semibold text-capitalize">{field.replace(/([A-Z])/g,' $1')}</Form.Label>
                <Form.Control
                  type={field === "admissionDate" ? "date" : "text"}
                  name={field}
                  value={newStudent[field]}
                  onChange={handleNewStudentChange}
                  placeholder={`Enter ${field}`}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button className="btn-3d" onClick={handleAddStudent}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
