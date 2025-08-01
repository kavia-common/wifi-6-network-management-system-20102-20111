import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../App.css";

// PUBLIC_INTERFACE
function DeviceFormPage({ mode }) {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [mac, setMac] = useState("");
  const [ip, setIp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && id) {
      api
        .get(`/devices/${id}`)
        .then((resp) => {
          setName(resp.data.name);
          setMac(resp.data.mac);
          setIp(resp.data.ip || "");
        })
        .catch(() => setError("Failed to load device"));
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEdit) {
        await api.put(`/devices/${id}`, { name, mac, ip });
      } else {
        await api.post("/devices/", { name, mac, ip });
      }
      navigate("/devices");
    } catch {
      setError("Failed to save device.");
    }
  };

  return (
    <div>
      <h2>{isEdit ? "Edit Device" : "Add Device"}</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
          <label>Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>MAC Address</label>
          <input required value={mac} onChange={(e) => setMac(e.target.value)} />
        </div>
        <div className="form-group">
          <label>IP Address</label>
          <input value={ip} onChange={(e) => setIp(e.target.value)} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-accent" type="submit">
          {isEdit ? "Update Device" : "Add Device"}
        </button>
      </form>
    </div>
  );
}

export default DeviceFormPage;
