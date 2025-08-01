import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../App.css";

// PUBLIC_INTERFACE
function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDevices = () => {
    setLoading(true);
    setError("");
    api
      .get("/devices/")
      .then((resp) => setDevices(resp.data || []))
      .catch(() => setError("Failed to fetch devices"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this device?")) return;
    setError("");
    try {
      await api.delete(`/devices/${id}`);
      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Failed to delete device");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ flex: 1 }}>Devices</h2>
        <Link to="/devices/new" className="btn btn-accent">
          + Add Device
        </Link>
      </div>
      {error && <div className="form-error" style={{ marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : devices.length === 0 ? (
        <p>No devices yet.</p>
      ) : (
        <table className="modern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>MAC Address</th>
              <th>IP</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {devices.map((dev) => (
              <tr key={dev.id}>
                <td>{dev.name}</td>
                <td>{dev.mac}</td>
                <td>{dev.ip || "-"}</td>
                <td>
                  <span
                    style={{
                      color:
                        dev.device_status === "online"
                          ? "green"
                          : "var(--secondary, #666)",
                    }}
                  >
                    {dev.device_status}
                  </span>
                </td>
                <td>
                  <Link to={`/devices/${dev.id}/edit`} className="btn btn-link">
                    Edit
                  </Link>
                  <button
                    className="btn btn-link"
                    style={{ color: "#b92d2b", marginLeft: 8 }}
                    onClick={() => handleDelete(dev.id)}
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

export default DevicesPage;
