import React, { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Tab,
  Button,
  Table,
  Form,
  Row,
  Col,
  Image,
  Spinner,
  Alert,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import "./Users.css"; // Custom styles for gradients & 3D effects

const API_BASE = "http://localhost:5008/api"; // server port 5008
const ITEMS_PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState({ student: [], teacher: [], admin: [] });
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [students, teachers, admins] = await Promise.all([
        axios.get(`${API_BASE}/students`),
        axios.get(`${API_BASE}/teachers`),
        axios.get(`${API_BASE}/admins`),
      ]);
      setUsers({
        student: students.data || [],
        teacher: teachers.data || [],
        admin: admins.data || [],
      });
    } catch {
      setAlertMsg("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData({ ...formData, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const tab = activeTab;

    if (tab === "admin" && (!formData.fullName || !formData.email)) {
      setAlertMsg("Full Name and Email are required for Admins.");
      return;
    }
    if (tab === "teacher" && (!formData.name || !formData.email)) {
      setAlertMsg("Name and Email are required for Teachers.");
      return;
    }
    if (tab === "student" && (!formData.name || !formData.rollNo)) {
      setAlertMsg("Name and Roll No are required for Students.");
      return;
    }

    if (tab === "student") {
      const duplicate = users.student.find(
        (s) =>
          s.rollNo === formData.rollNo &&
          (!editingItem || s._id !== editingItem._id)
      );
      if (duplicate) {
        setAlertMsg("Roll No must be unique!");
        return;
      }
    }

    try {
      if (editingItem) {
        await axios.put(`${API_BASE}/${tab}s/${editingItem._id}`, formData);
        setAlertMsg(`${tab} updated successfully.`);
      } else {
        await axios.post(`${API_BASE}/${tab}s/register`, formData);
        setAlertMsg(`${tab} added successfully.`);
      }
      setFormData({});
      setEditingItem(null);
      setPreviewImage("");
      fetchData();
    } catch (err) {
      setAlertMsg(err.response?.data?.error || `Failed to save ${tab}.`);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setPreviewImage(item.profileImage || "");
  };

  const handleDeleteUser = async (id) => {
    const tab = activeTab;
    if (!window.confirm(`Delete this ${tab}?`)) return;
    try {
      await axios.delete(`${API_BASE}/${tab}s/${id}`);
      setAlertMsg(`${tab} deleted successfully.`);
      fetchData();
    } catch (err) {
      setAlertMsg(err.response?.data?.error || `Failed to delete ${tab}.`);
    }
  };

  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (users[activeTab] || []).filter(
      (u) =>
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q) ||
        u.rollNo?.toLowerCase()?.includes(q) ||
        u.email?.toLowerCase()?.includes(q) ||
        u.department?.toLowerCase()?.includes(q)
    );
  }, [users, activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const formFields = {
    student: [
      { key: "name", label: "Name" },
      { key: "fatherName", label: "Father Name" },
      { key: "rollNo", label: "Roll No" },
      { key: "password", label: "Password", type: "password" },
      { key: "gender", label: "Gender" },
      { key: "dob", label: "Date of Birth", type: "date" },
      { key: "address", label: "Address" },
      { key: "department", label: "Department" },
    ],
    teacher: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password", type: "password" },
      { key: "phone", label: "Phone" },
      { key: "department", label: "Department" },
      { key: "position", label: "Position" },
    ],
    admin: [
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "password", label: "Password", type: "password" },
      { key: "phone", label: "Phone" },
      { key: "employeeId", label: "Employee ID" },
      { key: "department", label: "Department" },
    ],
  };

  return (
    <div className="p-3 users-page">
      <h4 className="gradient-text mb-3">Users Management</h4>
      {alertMsg && (
        <Alert variant="info" dismissible onClose={() => setAlertMsg("")}>
          {alertMsg}
        </Alert>
      )}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setFormData({});
          setEditingItem(null);
          setSearchQuery("");
          setPreviewImage("");
          setCurrentPage(1);
        }}
        className="custom-tabs"
      >
        <Tab eventKey="student" title="Students" />
        <Tab eventKey="teacher" title="Teachers" />
        <Tab eventKey="admin" title="Admins" />
      </Tabs>

      <Row className="mt-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
      </Row>

      <h5 className="mt-4 gradient-text">
        {editingItem ? `Edit ${activeTab}` : `Add New ${activeTab}`}
      </h5>
      <Form onSubmit={handleFormSubmit} className="border p-3 rounded form-3d">
        <Row>
          {formFields[activeTab].map(({ key, label, type }) => (
            <Col md={4} className="mb-2" key={key}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type={type || "text"}
                value={formData[key] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            </Col>
          ))}
          <Col md={4}>
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
            {previewImage && (
              <div className="mt-2 text-center">
                <Image
                  src={previewImage}
                  rounded
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              </div>
            )}
          </Col>
        </Row>
        <Button type="submit" className="btn-3d mt-2">
          {editingItem ? "Update" : "Add"}
        </Button>
      </Form>

      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="mt-3 shadow-sm table-3d"
          >
            <thead className="table-gradient">
              <tr>
                <th>#</th>
                {activeTab === "student" && (
                  <>
                    <th>Name</th>
                    <th>Father</th>
                    <th>Roll No</th>
                    <th>Department</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Profile</th>
                    <th>Actions</th>
                  </>
                )}
                {activeTab === "teacher" && (
                  <>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Profile</th>
                    <th>Actions</th>
                  </>
                )}
                {activeTab === "admin" && (
                  <>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Profile</th>
                    <th>Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((u, idx) => (
                <tr key={u._id || idx}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  {activeTab === "student" && (
                    <>
                      <td>{u.name}</td>
                      <td>{u.fatherName}</td>
                      <td>{u.rollNo}</td>
                      <td>{u.department}</td>
                      <td>{u.dob}</td>
                      <td>{u.gender}</td>
                      <td>
                        {u.profileImage && (
                          <Image
                            src={u.profileImage}
                            style={{ width: 40, height: 40 }}
                            rounded
                          />
                        )}
                      </td>
                    </>
                  )}
                  {activeTab === "teacher" && (
                    <>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.department}</td>
                      <td>{u.position}</td>
                      <td>
                        {u.profileImage && (
                          <Image
                            src={u.profileImage}
                            style={{ width: 40, height: 40 }}
                            rounded
                          />
                        )}
                      </td>
                    </>
                  )}
                  {activeTab === "admin" && (
                    <>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.employeeId}</td>
                      <td>{u.department}</td>
                      <td>
                        {u.profileImage && (
                          <Image
                            src={u.profileImage}
                            style={{ width: 40, height: 40 }}
                            rounded
                          />
                        )}
                      </td>
                    </>
                  )}
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2 btn-3d"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="btn-3d"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              />
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
