import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // Axios instance with baseURL /api

export default function SubordinateDashboard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState("TODO");
  const [commentText, setCommentText] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate(); 

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // Load tasks for this subordinate
  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = () => {
    api
      .get("/tasks/mytasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error loading tasks:", err));
  };

  const handleUpdateStatus = (taskId) => {
    api
      .put(`/tasks/${taskId}/status`, { status: newStatus })
      .then(() => {
        alert("Status updated!");
        loadMyTasks();
      })
      .catch(() => alert("Error updating status"));
  };

  const handleAddComment = (taskId) => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    api
      .post(`/tasks/${taskId}/comments`, { text: commentText })
      .then(() => {
        alert("Comment added!");
        setCommentText("");
      })
      .catch(() => alert("Error adding comment"));
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill both old and new passwords");
      return;
    }

    if (!loggedInUser) {
      alert("User not logged in");
      return;
    }

    api
      .put(`/tenant/users/${loggedInUser.id}/password`, {
        oldPassword,
        newPassword,
      })
      .then(() => {
        alert("Password changed successfully");
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          // Show server message if available
          alert(err.response.data.message || "Error changing password");
        } else {
          alert("Error changing password");
        }
        console.error(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login/subordinate");
  };

  if (!loggedInUser) {
    return <p>User not logged in</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setShowChangePassword(!showChangePassword)}>
          {showChangePassword ? "Cancel Password Change" : "Change Password"}
        </button>
        <button
          onClick={handleLogout}
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        >
          Logout
        </button>
      </div>

      {showChangePassword && (
        <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <h4>Change Password</h4>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={handleChangePassword}>Submit</button>
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
