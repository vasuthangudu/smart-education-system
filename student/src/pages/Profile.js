// src/pages/Profile.js
import React, { useState } from "react";
import studentData from "../data/student.json";

export default function Profile() {
  const [student, setStudent] = useState(studentData);
  const [isEditing, setIsEditing] = useState(false);

  // Update form fields
  const handleChange = (section, field, value) => {
    setStudent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Save profile
  const handleSave = () => {
    setIsEditing(false);
    console.log("✅ Updated Student Data:", student);
    alert("Profile updated successfully!");
  };

  const { profile, personalDetails, universityInfo, address } = student;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar Profile */}
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <img
              src={profile.image}
              alt="student"
              className="rounded-circle mx-auto mb-3"
              style={{ width: "120px", height: "120px" }}
            />
            <h5>{profile.name}</h5>
            <p className="text-muted mb-1">{profile.branch}</p>
            <p className="text-muted">Reg No: {profile.regNo}</p>

            {!isEditing ? (
              <>
                <button
                  className="btn btn-primary btn-sm mb-2 w-100"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil-square me-2"></i>Edit Profile
                </button>
                <button className="btn btn-outline-secondary btn-sm w-100">
                  <i className="bi bi-camera me-2"></i>Change Image
                </button>
              </>
            ) : (
              <button
                className="btn btn-success btn-sm w-100"
                onClick={handleSave}
              >
                💾 Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Main Section */}
        <div className="col-md-9">
          {!isEditing ? (
            <>
              {/* Personal Details */}
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="mb-3">👤 Personal Details</h5>
                <div className="row">
                  <div className="col-md-6"><strong>Father/Guardian Name:</strong> {personalDetails.fatherName}</div>
                  <div className="col-md-6"><strong>Email:</strong> {personalDetails.email}</div>
                  <div className="col-md-6"><strong>DOB:</strong> {personalDetails.dob}</div>
                  <div className="col-md-6"><strong>Gender:</strong> {personalDetails.gender}</div>
                  <div className="col-md-6"><strong>Nationality:</strong> {personalDetails.nationality}</div>
                  <div className="col-md-6"><strong>Religion:</strong> {personalDetails.religion}</div>
                  <div className="col-md-6"><strong>Emergency Contact:</strong> {personalDetails.emergencyContact}</div>
                </div>
              </div>

              {/* University Info */}
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="mb-3">🎓 University Information</h5>
                <div className="row">
                  <div className="col-md-6"><strong>Admission Number:</strong> {universityInfo.admissionNumber}</div>
                  <div className="col-md-6"><strong>Application Number:</strong> {universityInfo.applicationNumber}</div>
                  <div className="col-md-6"><strong>Fee Category:</strong> {universityInfo.feeCategory}</div>
                  <div className="col-md-6"><strong>Date of Admission:</strong> {universityInfo.dateOfAdmission}</div>
                  <div className="col-md-6"><strong>User ID:</strong> {universityInfo.userId}</div>
                  <div className="col-md-6"><strong>Class:</strong> {universityInfo.class}</div>
                  <div className="col-md-6"><strong>Semester:</strong> {universityInfo.semester}</div>
                  <div className="col-md-6"><strong>Eligibility Number:</strong> {universityInfo.eligibilityNumber}</div>
                </div>
              </div>

              {/* Address */}
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="mb-3">🏠 Address</h5>
                <div className="row">
                  <div className="col-md-6"><strong>Local / Present Address:</strong> {address.localAddress}</div>
                  <div className="col-md-6"><strong>Permanent Address:</strong> {address.permanentAddress}</div>
                  <div className="col-md-6"><strong>City:</strong> {address.city}</div>
                  <div className="col-md-6"><strong>State:</strong> {address.state}</div>
                  <div className="col-md-6"><strong>Zip Code:</strong> {address.zipCode}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Editable Form */}
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="mb-3">✏️ Edit Profile</h5>
                <form className="row g-3">
                  {/* Personal Info */}
                  <h6>👤 Personal Details</h6>
                  <div className="col-md-6">
                    <label className="form-label">Father/Guardian Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={personalDetails.fatherName}
                      onChange={(e) => handleChange("personalDetails", "fatherName", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" value={personalDetails.email}
                      onChange={(e) => handleChange("personalDetails", "email", e.target.value)} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">DOB <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" value={personalDetails.dob}
                      onChange={(e) => handleChange("personalDetails", "dob", e.target.value)} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gender <span className="text-danger">*</span></label>
                    <select className="form-control" value={personalDetails.gender}
                      onChange={(e) => handleChange("personalDetails", "gender", e.target.value)} required>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Nationality <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={personalDetails.nationality}
                      onChange={(e) => handleChange("personalDetails", "nationality", e.target.value)} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Religion</label>
                    <input type="text" className="form-control" value={personalDetails.religion}
                      onChange={(e) => handleChange("personalDetails", "religion", e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Emergency Contact <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={personalDetails.emergencyContact}
                      onChange={(e) => handleChange("personalDetails", "emergencyContact", e.target.value)} required />
                  </div>

                  {/* University Info */}
                  <h6 className="mt-3">🎓 University Information</h6>
                  {Object.keys(universityInfo).map((key, idx) => (
                    <div className="col-md-6" key={idx}>
                      <label className="form-label">
                        {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                        {["admissionNumber","applicationNumber","userId"].includes(key) && <span className="text-danger">*</span>}
                      </label>
                      <input type="text" className="form-control" value={universityInfo[key]}
                        onChange={(e) => handleChange("universityInfo", key, e.target.value)} required />
                    </div>
                  ))}

                  {/* Address */}
                  <h6 className="mt-3">🏠 Address</h6>
                  {Object.keys(address).map((key, idx) => (
                    <div className="col-md-6" key={idx}>
                      <label className="form-label">
                        {key.replace(/([A-Z])/g, " $1")}{" "}
                        {["localAddress","permanentAddress","city","state"].includes(key) && <span className="text-danger">*</span>}
                      </label>
                      <input type="text" className="form-control" value={address[key]}
                        onChange={(e) => handleChange("address", key, e.target.value)} required />
                    </div>
                  ))}
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
