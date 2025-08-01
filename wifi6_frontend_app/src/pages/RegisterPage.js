import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./auth.css";

// PUBLIC_INTERFACE
function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users/register", {
        username,
        password,
        full_name: fullName || undefined,
      });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try a different username.");
    }
  };

  return (
    <div className="auth-box">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            required
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            autoComplete="name"
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-accent" type="submit">
          Register
        </button>
      </form>
      <div style={{ marginTop: 18, color: "var(--text-secondary, #666)" }}>
        Already registered? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
