import React, { useEffect, useState } from "react";
import api from "../../api"; // axios instance

export default function SubordinateDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState("TODO");
  const [commentText, setCommentText] = useState("");

  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // or wherever you store it
  const userId = user.id;

  // Get userId from token (assuming JWT)
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id;
  };
  //const userId = getUserIdFromToken();

  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = () => {
    api.get("/tasks/mytasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error("Error loading tasks:", err));
  };

  const handleUpdateStatus = (taskId) => {
    api.put(`/tasks/${taskId}/status`, { status: newStatus })
      .then(() => {
        alert("Status updated!");
        loadMyTasks();
      })
      .catch(() => alert("Error updating status"));
  };

  const handleAddComment = (taskId) => {
    api.post(`/tasks/${taskId}/comments`, { text: commentText })
      .then(() => {
        alert("Comment added!");
        setCommentText("");
      })
      .catch(() => alert("Error adding comment"));
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    try {
      const res = await api.put(`/tenant/users/${userId}/password`, {
        oldPassword,
        newPassword
      });
      alert(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      const msg = err.response?.data?.error || JSON.stringify(err.response?.data) || "Error changing password";
      setPasswordError(msg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>

      <button onClick={() => setShowPasswordForm(!showPasswordForm)} style={{ marginBottom: "20px", marginRight: "10px" }}>
        Change Password
      </button>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {showPasswordForm && (
        <div style={{ marginBottom: "30px" }}>
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />
          <button onClick={handleChangePassword}>Save Password</button>
        </div>
      )}

      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Update Status</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.dueDate}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>
                <select
                  value={selectedTaskId === t.id ? newStatus : t.status}
                  onChange={(e) => {
                    setSelectedTaskId(t.id);
                    setNewStatus(e.target.value);
                  }}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                <button onClick={() => handleUpdateStatus(t.id)}>Save</button>
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Add comment"
                  value={selectedTaskId === t.id ? commentText : ""}
                  onChange={(e) => {
                    setSelectedTaskId(t.id);
                    setCommentText(e.target.value);
                  }}
                />
                <button onClick={() => handleAddComment(t.id)}>Add</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
