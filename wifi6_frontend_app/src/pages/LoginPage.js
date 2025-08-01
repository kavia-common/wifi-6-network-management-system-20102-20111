import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { setToken, getToken } from "../utils/auth";
import "./auth.css";

// PUBLIC_INTERFACE
function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  if (getToken()) {
    navigate("/");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // NOTE: Backend expects x-www-form-urlencoded for /users/login
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const resp = await api.post("/users/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setToken(resp.data.access_token);
      navigate("/");
    } catch (err) {
      setErrorMsg("Login failed: invalid credentials");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMsg && <div className="form-error">{errorMsg}</div>}
        <button className="btn btn-accent" type="submit">
          Login
        </button>
      </form>
      <div style={{ marginTop: 18, color: "var(--text-secondary, #666)" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;
