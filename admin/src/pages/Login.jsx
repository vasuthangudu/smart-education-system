import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminsData from "../data/admins.json";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login({ setLoggedInAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const admin = adminsData.find(
      (a) => a.email === email && a.password === password
    );

    if (admin) {
      // Exclude password before saving to state
      const { password, ...adminData } = admin;
      setLoggedInAdmin(adminData);
      navigate("/");
    } else {
      setError("❌ Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ width: "380px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          Smart Education System <br />
          <span className="text-secondary fs-5">Admin Login</span>
        </h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alice@example.com"
              required
            />
            <div className="form-text text-muted">
              Use your registered admin email.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <div className="form-text text-muted">
              Password is case-sensitive.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 shadow-sm"
            style={{ backgroundColor: "#2575fc", borderColor: "#2575fc" }}
          >
            🚀 Login to Dashboard
          </button>
        </form>
        <p className="mt-3 mb-0 text-center text-muted small">
          © 2025 Smart Education System
        </p>
      </div>
    </div>
  );
}
