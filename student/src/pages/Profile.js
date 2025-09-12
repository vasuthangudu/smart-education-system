// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!student) {
      navigate("/login");
      return;
    }
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/students");
        const fresh = data.find((s) => s._id === student._id);
        setDetails(fresh || student);
      } catch (err) {
        console.error("Failed to fetch student:", err);
        setDetails(student);
      }
    };
    fetchStudent();
  }, [student, navigate]);

  if (!details) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header with Logout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Student Profile</h2>
        <button
          className="btn btn-danger"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="card shadow-lg p-4">
        <div className="text-center">
          {details.profileImage ? (
            <img
              src={details.profileImage}
              alt={details.name}
              className="rounded-circle mb-3 border"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mb-3"
              style={{ width: "150px", height: "150px", fontSize: "2rem" }}
            >
              {details.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="fw-bold">{details.name}</h3>
          <p className="text-muted">{details.department}</p>
        </div>

        {/* Info Grid */}
        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <div className="border rounded p-3 bg-light">
              <h5 className="fw-bold">Basic Information</h5>
              <p>
                <strong>Email:</strong> {details.email}
              </p>
              <p>
                <strong>Father's Name:</strong> {details.fatherName}
              </p>
              <p>
                <strong>Gender:</strong> {details.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong> {details.dob}
              </p>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="border rounded p-3 bg-light">
              <h5 className="fw-bold">Address & Department</h5>
              <p>
                <strong>Address:</strong> {details.address}
              </p>
              <p>
                <strong>Department:</strong> {details.department}
              </p>
            </div>
          </div>
        </div>

        {/* Raw JSON for debugging (optional) */}
        {/* <pre className="bg-dark text-white p-3 rounded mt-3">
          {JSON.stringify(details, null, 2)}
        </pre> */}
      </div>
    </div>
  );
}
