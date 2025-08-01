import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// PUBLIC_INTERFACE
const Sidebar = () => (
  <aside className="sidebar">
    <nav>
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <span role="img" aria-label="dashboard">📊</span> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/devices" className={({ isActive }) => isActive ? "active" : ""}>
            <span role="img" aria-label="devices">🖧</span> Devices
          </NavLink>
        </li>
        <li>
          <NavLink to="/configs" className={({ isActive }) => isActive ? "active" : ""}>
            <span role="img" aria-label="configs">🔧</span> Configs
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
