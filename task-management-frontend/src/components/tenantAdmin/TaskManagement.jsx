import React, { useEffect, useState } from "react";
import api from "../../api";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [status, setStatus] = useState("TODO");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  const loadTasks = () => {
    api.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  };

  const loadUsers = () => {
    api.get("/tenant/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const handleCreateOrUpdateTask = (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      dueDate,
      priority,
      status,
      userId: Number(assignedUserId)
    };

    if (editingTaskId) {
      // Update task
      api.put(`/tasks/${editingTaskId}`, payload)
        .then(() => {
          alert("Task updated successfully!");
          resetForm();
          loadTasks();
        })
        .catch((err) => alert("Error updating task: " + (err.response?.data || err.message)));
    } else {
      // Create task
      api.post("/tasks", payload)
        .then(() => {
          alert("Task created successfully!");
          resetForm();
          loadTasks();
        })
        .catch((err) => alert("Error creating task: " + (err.response?.data || err.message)));
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("LOW");
    setStatus("TODO");
    setAssignedUserId("");
    setEditingTaskId(null);
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setAssignedUserId(task.user?.id || "");
    setEditingTaskId(task.id);
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      api.delete(`/tasks/${taskId}`)
        .then(() => {
          alert("Task deleted successfully!");
          loadTasks();
        })
        .catch((err) => alert("Error deleting task: " + (err.response?.data || err.message)));
    }
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(t => 
    (!filterStatus || t.status === filterStatus) &&
    (!filterUserId || t.user?.id === Number(filterUserId)) &&
    (!filterDueDate || t.dueDate === filterDueDate)
  );

  const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

  return (
    <div style={{ padding: "20px", fontSize: "16px" }}>
      <h2>Task Management</h2>

      {/* Task Form */}
      <form onSubmit={handleCreateOrUpdateTask} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: "8px", fontSize: "16px" }}/>
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: "8px", fontSize: "16px" }}/>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ padding: "8px", fontSize: "16px" }}/>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: "8px", fontSize: "16px" }}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "8px", fontSize: "16px" }}>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)} required style={{ padding: "8px", fontSize: "16px" }}>
          <option value="">Assign to user</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>
        <button type="submit" style={{ padding: "8px", fontSize: "16px", cursor: "pointer" }}>
          {editingTaskId ? "Update Task" : "Create Task"}
        </button>
      </form>

      {/* Filters */}
      <h3 style={{ marginTop: "30px" }}>Filter Tasks</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "6px", fontSize: "16px" }}>
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} style={{ padding: "6px", fontSize: "16px" }}>
          <option value="">All Users</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>
        <input type="date" value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)} style={{ padding: "6px", fontSize: "16px" }}/>
        <button onClick={() => { setFilterStatus(""); setFilterUserId(""); setFilterDueDate(""); }} style={{ padding: "6px", fontSize: "16px", cursor: "pointer" }}>Clear Filters</button>
      </div>

      {/* Tasks Table */}
      <h3>Existing Tasks</h3>
      <table border="1" cellPadding="5" style={{ fontSize: "16px", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(t => (
            <tr key={t.id} style={{ color: t.dueDate < today ? "red" : "inherit" }}>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.dueDate}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>{t.user?.username}</td>
              <td style={{ display: "flex", gap: "5px" }}>
                <button onClick={() => handleEdit(t)} style={{ padding: "4px 8px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(t.id)} style={{ padding: "4px 8px", cursor: "pointer", backgroundColor: "#f44336", color: "white" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
