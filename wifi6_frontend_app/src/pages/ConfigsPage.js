import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../App.css";

// PUBLIC_INTERFACE
function ConfigsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/configs/")
      .then((resp) => {
        if (mounted) setConfigs(resp.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ flex: 1 }}>Configs</h2>
        <Link to="/configs/new" className="btn btn-accent">
          + Add Config
        </Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : configs.length === 0 ? (
        <p>No configurations found.</p>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Device ID</th>
              <th>SSID</th>
              <th>Password</th>
              <th>Channel</th>
              <th>WPA3</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {configs.map((cfg) => (
              <tr key={cfg.id}>
                <td>{cfg.id}</td>
                <td>{cfg.device_id}</td>
                <td>{cfg.ssid}</td>
                <td>{"*".repeat(Math.max(0, (cfg.password || '').length))}</td>
                <td>{cfg.channel}</td>
                <td>{cfg.wpa3_enabled ? "✔" : ""}</td>
                <td>
                  <Link
                    to={`/configs/${cfg.id}/edit`}
                    className="btn btn-link"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConfigsPage;
