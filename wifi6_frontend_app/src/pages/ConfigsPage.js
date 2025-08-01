import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../App.css";

// PUBLIC_INTERFACE
function ConfigsPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConfigs = () => {
    setLoading(true);
    setError("");
    api
      .get("/configs/")
      .then((resp) => setConfigs(resp.data || []))
      .catch(() => setError("Failed to fetch configs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConfigs();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this config?")) return;
    setError("");
    try {
      await api.delete(`/configs/${id}`);
      setConfigs((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete config");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ flex: 1 }}>Configs</h2>
        <Link to="/configs/new" className="btn btn-accent">
          + Add Config
        </Link>
      </div>
      {error && <div className="form-error" style={{ marginBottom: 8 }}>{error}</div>}
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
                  <button
                    className="btn btn-link"
                    style={{ color: "#b92d2b", marginLeft: 8 }}
                    onClick={() => handleDelete(cfg.id)}
                  >
                    Delete
                  </button>
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
