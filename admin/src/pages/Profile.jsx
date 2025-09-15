import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile({ loggedInAdmin }) {
  // Simulated additional info (e.g., activity logs or team members)
  const additionalInfo = loggedInAdmin?.members || []; // Array of members if provided
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!loggedInAdmin) {
    return <p className="text-center mt-5 fw-bold text-danger">⚠ No admin data available.</p>;
  }

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = additionalInfo.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(additionalInfo.length / itemsPerPage);

  return (
    <div className="container mt-5">
      {/* Profile Card */}
      <div
        className="card shadow-lg p-4 text-white"
        style={{
          maxWidth: "650px",
          margin: "auto",
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          transform: "perspective(1000px) rotateX(1deg) rotateY(1deg)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div className="text-center mb-4">
          <img
            src={loggedInAdmin.profileImage}
            alt={loggedInAdmin.fullName}
            className="rounded-circle shadow-lg border border-3 border-light"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          />
          <h3
            className="mt-3 fw-bold"
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1px" }}
          >
            {loggedInAdmin.fullName}
          </h3>
          <span className="badge bg-light text-dark fs-6 shadow-sm">
            {loggedInAdmin.role}
          </span>
        </div>

        {/* Details Table */}
        <div className="table-responsive mb-3">
          <table className="table table-bordered table-hover text-white align-middle">
            <tbody>
              <tr>
                <th>Email</th>
                <td>{loggedInAdmin.email}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{loggedInAdmin.phone}</td>
              </tr>
              <tr>
                <th>Employee ID</th>
                <td>{loggedInAdmin.employeeId}</td>
              </tr>
              <tr>
                <th>Department</th>
                <td>{loggedInAdmin.department}</td>
              </tr>
              <tr>
                <th>Joining Date</th>
                <td>{loggedInAdmin.joiningDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Additional Info / Members */}
        {additionalInfo.length > 0 && (
          <>
            <h5 className="fw-bold text-center mb-3">Team Members</h5>
            <div className="table-responsive">
              <table className="table table-striped table-hover table-light rounded">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((member, index) => (
                    <tr key={index}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Buttons */}
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-outline-light me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ◀ Prev
              </button>
              <span className="text-light align-self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-outline-light ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
