import React, { useEffect, useState } from "react";
import api from "../../api"; // Axios instance with dynamic token

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Load users once on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/tenant/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Load users error:", err);
      setError(err.response?.data || "Error loading users");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tenant/users", { username, password });
      alert("User created successfully!");
      setUsername("");
      setPassword("");
      fetchUsers(); // refresh the list
    } catch (err) {
      console.error("Create user error:", err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Error creating user");
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.put(`/tenant/users/${userId}/status`);
      fetchUsers(); // refresh list after toggle
    } catch (err) {
      console.error("Toggle status error:", err);
      alert("Error toggling user status");
    }
  };

  return (
    <div style={{ fontSize: "18px", maxWidth: "400px", margin: "auto" }}>
      <h2>User Management</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "8px", fontSize: "16px", cursor: "pointer" }}>Create User</button>
      </form>

      <h3 style={{ marginTop: "20px" }}>Users</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span>
              {u.username} ({u.enabled ? "Enabled" : "Disabled"})
            </span>
            <button
              onClick={() => toggleUserStatus(u.id)}
              style={{ padding: "5px 10px", cursor: "pointer" }}
            >
              {u.enabled ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


