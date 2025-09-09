import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function UsersPage() {
  // Initial mock data (replace with API calls in real project)
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Johnson", role: "Student", email: "alice@mail.com" },
    { id: 2, name: "Bob Smith", role: "Teacher", email: "bob@mail.com" },
    { id: 3, name: "Charlie Brown", role: "Admin", email: "charlie@mail.com" },
    { id: 4, name: "David Miller", role: "Student", email: "david@mail.com" },
  ]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });
  const [editUser, setEditUser] = useState(null);

  // Add new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return alert("Please fill all fields");
    const id = users.length + 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: "", email: "", role: "Student" });
  };

  // Edit user
  const handleEditUser = (id) => {
    setUsers(users.map((u) => (u.id === id ? editUser : u)));
    setEditUser(null);
  };

  // Delete user
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  // Filter + Search
  const filteredUsers = users.filter((u) => {
    return (
      (filterRole === "All" || u.role === filterRole) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Count by role
  const roleCounts = {
    Students: users.filter((u) => u.role === "Student").length,
    Teachers: users.filter((u) => u.role === "Teacher").length,
    Admins: users.filter((u) => u.role === "Admin").length,
  };

  return (
    <div className="container mt-4">
      <div className="card p-3 shadow-sm">
        <h4 className="mb-3 text-primary">Users Management (Admin Side)</h4>

        {/* Role Counts */}
        <div className="d-flex gap-3 mb-3">
          <span className="badge bg-primary p-2">Students: {roleCounts.Students}</span>
          <span className="badge bg-success p-2">Teachers: {roleCounts.Teachers}</span>
          <span className="badge bg-danger p-2">Admins: {roleCounts.Admins}</span>
        </div>

        {/* Search & Filter */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search by name/email"
            className="form-control w-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select w-25"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option>All</option>
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
        </div>

        {/* User Table */}
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editUser.name}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <input
                      type="email"
                      className="form-control"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editUser && editUser.id === user.id ? (
                    <select
                      className="form-select"
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                    >
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
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleEditUser(user.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditUser(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setEditUser(user)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add User Form */}
        <div className="card p-3 mt-4">
          <h5>Add New User</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option>Student</option>
                <option>Teacher</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100" onClick={handleAddUser}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
