import React, { useState } from "react";
import api from "../../api";

export default function ChangePassword({ userId }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      await api.put(`/tenant/users/${userId}/password`, {
        oldPassword,
        newPassword
      });
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Error changing password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", fontSize: "16px" }}>
      <h2>Change Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px", cursor: "pointer" }}>Change Password</button>
      </form>
    </div>
  );
}
