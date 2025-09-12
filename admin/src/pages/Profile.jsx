import React from "react";

export default function Profile({ loggedInAdmin }) {
  if (!loggedInAdmin) {
    return <p className="text-center mt-5">No admin data available.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="text-center mb-4">
          <img
            src={loggedInAdmin.profileImage}
            alt={loggedInAdmin.fullName}
            className="rounded-circle shadow"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h3 className="mt-3">{loggedInAdmin.fullName}</h3>
          <p className="text-muted">{loggedInAdmin.role}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item"><strong>Email:</strong> {loggedInAdmin.email}</li>
          <li className="list-group-item"><strong>Phone:</strong> {loggedInAdmin.phone}</li>
          <li className="list-group-item"><strong>Employee ID:</strong> {loggedInAdmin.employeeId}</li>
          <li className="list-group-item"><strong>Department:</strong> {loggedInAdmin.department}</li>
          <li className="list-group-item"><strong>Joining Date:</strong> {loggedInAdmin.joiningDate}</li>
        </ul>
      </div>
    </div>
  );
}
