import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { getToken, clearToken } from "../utils/auth";
import "./Navbar.css";

// PUBLIC_INTERFACE
function Navbar({ theme, toggleTheme }) {
  const isLoggedIn = !!getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav className={classNames("navbar", `navbar-${theme}`)}>
      <div className="navbar-left">
        <span className="navbar-brand">WiFi 6 Config Manager</span>
      </div>
      <div className="navbar-center">
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/devices" className="nav-link">
              Devices
            </Link>
            <Link to="/configs" className="nav-link">
              Configs
            </Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {isLoggedIn ? (
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-link">
              Login
            </Link>
            <Link to="/register" className="btn btn-accent">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
