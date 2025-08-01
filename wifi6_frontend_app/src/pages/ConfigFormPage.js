import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../App.css";

// PUBLIC_INTERFACE
function ConfigFormPage({ mode }) {
  const { id } = useParams();
  const [deviceId, setDeviceId] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [channel, setChannel] = useState("");
  const [wpa3, setWpa3] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && id) {
      api
        .get(`/configs/${id}`)
        .then((resp) => {
          setDeviceId(resp.data.device_id || "");
          setSsid(resp.data.ssid || "");
          setPassword(resp.data.password || "");
          setChannel(resp.data.channel ? String(resp.data.channel) : "");
          setWpa3(!!resp.data.wpa3_enabled);
        })
        .catch(() => setError("Failed to load config"));
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      device_id: parseInt(deviceId, 10),
      ssid,
      password,
      channel: parseInt(channel, 10),
      wpa3_enabled: !!wpa3,
    };
    try {
      if (isEdit) {
        await api.put(`/configs/${id}`, payload);
      } else {
        await api.post("/configs/", payload);
      }
      navigate("/configs");
    } catch {
      setError("Failed to save config.");
    }
  };

  return (
    <div>
      <h2>{isEdit ? "Edit Config" : "Add Config"}</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
          <label>Device ID</label>
          <input
            required
            type="number"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>SSID</label>
          <input
            required
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Channel</label>
          <input
            required
            type="number"
            min="1"
            max="165"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={wpa3}
              onChange={(e) => setWpa3(e.target.checked)}
            />{" "}
            WPA3 Enabled?
          </label>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-accent" type="submit">
          {isEdit ? "Update Config" : "Add Config"}
        </button>
      </form>
    </div>
  );
}

export default ConfigFormPage;
