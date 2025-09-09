import React, { useState } from "react";

function Users() {
  // Initial dummy users
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "Student", course: "Math" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "Teacher", course: "Science" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "Admin", course: "-" },
    { id: 4, name: "David", email: "david@example.com", role: "Student", course: "History" },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student", course: "" });
  const [editUser, setEditUser] = useState(null);

  // Stats
  const totalStudents = users.filter((u) => u.role === "Student").length;
  const totalTeachers = users.filter((u) => u.role === "Teacher").length;
  const totalAdmins = users.filter((u) => u.role === "Admin").length;

  // Filter logic
  const filteredUsers = users.filter(
    (user) =>
      (roleFilter === "All" || user.role === roleFilter) &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return alert("Please fill all fields!");
    const id = users.length + 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ name: "", email: "", role: "Student", course: "" });
    window.bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
  };

  // Edit user
  const handleUpdateUser = () => {
    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    setEditUser(null);
    window.bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
  };

  // Delete user
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="card p-3 shadow-sm">
      <h4 className="mb-3 text-primary">Users Management</h4>

      {/* Stats */}
      <div className="row mb-3 text-center">
        <div className="col">
          <div className="card bg-primary text-white p-2">
            <h6>Students</h6>
            <h5>{totalStudents}</h5>
          </div>
        </div>
        <div className="col">
          <div className="card bg-success text-white p-2">
            <h6>Teachers</h6>
            <h5>{totalTeachers}</h5>
          </div>
        </div>
        <div className="col">
          <div className="card bg-danger text-white p-2">
            <h6>Admins</h6>
            <h5>{totalAdmins}</h5>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Student">Students</option>
          <option value="Teacher">Teachers</option>
          <option value="Admin">Admins</option>
        </select>
        <button
          className="btn btn-primary ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#addUserModal"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Course</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === "Student"
                        ? "bg-primary"
                        : user.role === "Teacher"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{user.course || "-"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#editUserModal"
                    onClick={() => setEditUser(user)}
                  >
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <select
                className="form-select mb-2"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
              {newUser.role !== "Admin" && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Assigned Course"
                  value={newUser.course}
                  onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal fade show" id="editUserModal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={() => setEditUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
                <select
                  className="form-select mb-2"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
                {editUser.role !== "Admin" && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Assigned Course"
                    value={editUser.course}
                    onChange={(e) => setEditUser({ ...editUser, course: e.target.value })}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleUpdateUser}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
