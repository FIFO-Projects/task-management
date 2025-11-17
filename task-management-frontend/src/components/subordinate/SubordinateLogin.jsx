import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const SubordinateLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useParams(); // get role from URL

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password
      });

      console.log("Login response:", response.data);

      // Save token and full user info as one object
      const user = {
        username: response.data.username,
        role: response.data.role,
        id: response.data.id || null // if backend doesn't send id, you may add it later
      };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      if (response.data.role === "SUBORDINATE") {
        navigate("/subordinate"); // correct path
      } else {
        setError("You are not authorized to access this page");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  // Safe display for role
  const displayRole = role ? role.split("_").join(" ") : "Subordinate";

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{displayRole} Login</h2>
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

export default SubordinateLogin;
