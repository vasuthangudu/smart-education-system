import React, { useState } from "react";
import teachers from "../data/teachers.json";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const found = teachers.find(
      (t) =>
        t.email.toLowerCase() === email.toLowerCase() &&
        t.password === password
    );

    if (!found) {
      setError("Invalid credentials. Please check email/password.");
      return;
    }

    localStorage.setItem("loggedTeacherId", found.id);
    navigate("/profile");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert(`Registered as: ${username}`);
    // You can extend this to save new teacher to JSON/backend
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ width: "700px" }}>
        <div className="row g-0">
          {/* Left Panel */}
          <div className="col-md-6 p-4 d-flex flex-column justify-content-center text-white bg-dark">
            {!isRegister ? (
              <div className="animate__animated animate__fadeInLeft">
                <h2 className="fw-bold">Welcome Back!</h2>
                <p className="mb-4">Already have an account?</p>
                <button
                  className="btn btn-outline-warning rounded-pill"
                  onClick={() => setIsRegister(false)}
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="animate__animated animate__fadeInLeft">
                <h2 className="fw-bold">Hello, Welcome!</h2>
                <p className="mb-4">Don't have an account?</p>
                <button
                  className="btn btn-outline-warning rounded-pill"
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Right Panel (Forms) */}
          <div className="col-md-6 bg-light p-4 rounded-end">
            {!isRegister ? (
              <form onSubmit={handleLogin} className="animate__animated animate__fadeInRight">
                <h3 className="fw-bold mb-4 text-center">Login</h3>

                {error && (
                  <div className="alert alert-danger text-center">{error}</div>
                )}

                <div className="mb-3 position-relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control rounded-pill ps-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <i className="bi bi-envelope-fill position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="form-control rounded-pill ps-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`bi ${
                      showPassword ? "bi-eye-slash" : "bi-eye"
                    } position-absolute top-50 end-0 translate-middle-y me-3 text-muted`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <a href="/" className="small text-decoration-none">
                    Forgot Password?
                  </a>
                </div>

                <button className="btn btn-warning w-100 rounded-pill fw-bold mb-3">
                  Login
                </button>

                <p className="text-center mt-3 small">or login with</p>
                <div className="d-flex justify-content-center gap-3">
                  <i className="bi bi-google fs-4 text-danger"></i>
                  <i className="bi bi-facebook fs-4 text-primary"></i>
                  <i className="bi bi-github fs-4"></i>
                  <i className="bi bi-linkedin fs-4 text-info"></i>
                </div>

                <p className="text-center mt-3 small">
                  Don't have an account?{" "}
                  <span
                    className="text-warning fw-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsRegister(true)}
                  >
                    Register
                  </span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="animate__animated animate__fadeInRight">
                <h3 className="fw-bold mb-4 text-center">Register</h3>

                <div className="mb-3 position-relative">
                  <input
                    type="text"
                    placeholder="Username"
                    className="form-control rounded-pill ps-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <i className="bi bi-person-fill position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control rounded-pill ps-4"
                    required
                  />
                  <i className="bi bi-envelope-fill position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control rounded-pill ps-4"
                    required
                  />
                  <i className="bi bi-lock-fill position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>

                <button className="btn btn-warning w-100 rounded-pill fw-bold mb-3">
                  Register
                </button>

                <p className="text-center mt-3 small">or register with</p>
                <div className="d-flex justify-content-center gap-3">
                  <i className="bi bi-google fs-4 text-danger"></i>
                  <i className="bi bi-facebook fs-4 text-primary"></i>
                  <i className="bi bi-github fs-4"></i>
                  <i className="bi bi-linkedin fs-4 text-info"></i>
                </div>

                <p className="text-center mt-3 small">
                  Already have an account?{" "}
                  <span
                    className="text-warning fw-bold"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsRegister(false)}
                  >
                    Login
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
