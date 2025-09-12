import React from "react";

export default function Profile({ teacher }) {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">👤 Teacher Profile</h2>
      <div className="card shadow-sm p-4">
        {/* Profile Image and Name */}
        <div className="text-center mb-4">
          <img
            src={teacher.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="rounded-circle border"
            width="150"
            height="150"
          />
          <h4 className="mt-3">{teacher.name}</h4>
          <span className="text-muted">{teacher.department}</span>
        </div>

        {/* Teacher Info */}
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Email:</strong> {teacher.email}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {teacher.phone}
          </li>
          <li className="list-group-item">
            <strong>Department:</strong> {teacher.department}
          </li>
        </ul>
      </div>
    </div>
  );
}
