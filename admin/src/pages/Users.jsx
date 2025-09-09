import React, { useState } from "react";
import { Modal, Button, Form, Tab, Tabs, Table } from "react-bootstrap";

function Users() {
  // Dummy user data
  const [users, setUsers] = useState({
    admin: [
      { id: 1, name: "Admin One", email: "admin1@example.com" },
      { id: 2, name: "Admin Two", email: "admin2@example.com" },
    ],
    teacher: [
      { id: 1, name: "John Doe", email: "john@example.com", subject: "Math" },
      { id: 2, name: "Alice Smith", email: "alice@example.com", subject: "Science" },
    ],
    student: [
      { id: 1, name: "Student One", email: "student1@example.com", roll: "101" },
      { id: 2, name: "Student Two", email: "student2@example.com", roll: "102" },
    ],
  });

  const [activeTab, setActiveTab] = useState("admin");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", subject: "", roll: "" });

  const handleAddUser = () => {
    const updatedUsers = { ...users };
    const newId = updatedUsers[activeTab].length + 1;
    updatedUsers[activeTab].push({ id: newId, ...newUser });
    setUsers(updatedUsers);
    setShowModal(false);
    setNewUser({ name: "", email: "", subject: "", roll: "" });
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = { ...users };
    updatedUsers[activeTab] = updatedUsers[activeTab].filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <div className="card p-3 shadow-sm">
      <h4 className="mb-3 text-primary">Users Management</h4>
      <p>Manage Admins, Teachers, and Students here.</p>

      {/* Tabs for user types */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="admin" title="Admins"></Tab>
        <Tab eventKey="teacher" title="Teachers"></Tab>
        <Tab eventKey="student" title="Students"></Tab>
      </Tabs>

      {/* Add User Button */}
      <Button className="mb-3" onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-circle me-2"></i>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </Button>

      {/* User Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            {activeTab === "teacher" && <th>Subject</th>}
            {activeTab === "student" && <th>Roll No</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users[activeTab].map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {activeTab === "teacher" && <td>{user.subject}</td>}
              {activeTab === "student" && <td>{user.roll}</td>}
              <td>
                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>

            {activeTab === "teacher" && (
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter subject"
                  value={newUser.subject}
                  onChange={(e) => setNewUser({ ...newUser, subject: e.target.value })}
                />
              </Form.Group>
            )}

            {activeTab === "student" && (
              <Form.Group className="mb-3">
                <Form.Label>Roll Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter roll number"
                  value={newUser.roll}
                  onChange={(e) => setNewUser({ ...newUser, roll: e.target.value })}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Users;
