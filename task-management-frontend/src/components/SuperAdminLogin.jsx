import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api"

const SuperAdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        username,
        password
      });

      console.log("Login response:", response.data);

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);

      // Only allow SUPER_ADMIN to go to dashboard
      if (response.data.role === "SUPER_ADMIN") {
        navigate("/dashboard");
      } else {
        setError("You are not authorized to access this page");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  // Safe display for role
  const displayRole = role ? role.split("_").join(" ") : "SUPER ADMIN";

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{displayRole} LOGIN</h2>
      <form
        style={{ display: "inline-block", textAlign: "left", marginTop: "20px" }}
        onSubmit={handleLogin}
      >
        <label>Username</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <label>Password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default SuperAdminLogin;
