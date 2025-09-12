import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  if (!student) return null; // handled by routing

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">{student.name}'s Profile</h2>
        <p className="text-muted">Student Dashboard / Profile</p>
      </div>

      <div className="row">
        {/* Basic Info */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Basic Info</h5>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <p><strong>Year/Sem:</strong> {student.year}</p>
              <p><strong>Section:</strong> {student.section}</p>
              <p><strong>Courses:</strong> {student.courses.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Personal Details</h5>
              <p><strong>Father:</strong> {student.profile.personalDetails.fatherName}</p>
              <p><strong>DOB:</strong> {student.profile.personalDetails.dob}</p>
              <p><strong>Gender:</strong> {student.profile.personalDetails.gender}</p>
              <p><strong>Nationality:</strong> {student.profile.personalDetails.nationality}</p>
              <p><strong>Religion:</strong> {student.profile.personalDetails.religion}</p>
              <p><strong>Emergency:</strong> {student.profile.personalDetails.emergencyContact}</p>
            </div>
          </div>
        </div>

        {/* University Info */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">University Info</h5>
              <p><strong>Admission No:</strong> {student.profile.universityInfo.admissionNumber}</p>
              <p><strong>Application No:</strong> {student.profile.universityInfo.applicationNumber}</p>
              <p><strong>Fee Category:</strong> {student.profile.universityInfo.feeCategory}</p>
              <p><strong>Date of Admission:</strong> {student.profile.universityInfo.dateOfAdmission}</p>
              <p><strong>User ID:</strong> {student.profile.universityInfo.userId}</p>
              <p><strong>Class:</strong> {student.profile.universityInfo.class}</p>
              <p><strong>Semester:</strong> {student.profile.universityInfo.semester}</p>
              <p><strong>Eligibility No:</strong> {student.profile.universityInfo.eligibilityNumber}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Address</h5>
              <p><strong>Local:</strong> {student.profile.address.localAddress}</p>
              <p><strong>Permanent:</strong> {student.profile.address.permanentAddress}</p>
              <p><strong>City:</strong> {student.profile.address.city}</p>
              <p><strong>State:</strong> {student.profile.address.state}</p>
              <p><strong>ZIP:</strong> {student.profile.address.zipCode}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          className="btn btn-danger btn-lg"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
