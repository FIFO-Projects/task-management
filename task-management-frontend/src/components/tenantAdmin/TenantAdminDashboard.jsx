import React, { useState } from "react";
import UserManagement from "./UserManagement";
import TaskManagement from "./TaskManagement";

export default function TenantAdminDashboard() {
  const [activeView, setActiveView] = useState("users");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          fontSize: "22px",
          width: "200px",
          background: "#f4f4f4",
          padding: "1rem",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3>TENANT ADMIN</h3>
        <button
          onClick={() => setActiveView("users")}
          style={{
            fontSize: "20px",
            display: "block",
            width: "100%",
            marginBottom: "8px",
            background: activeView === "users" ? "#ddd" : "transparent",
          }}
        >
          Manage Users
        </button>
        <button
          onClick={() => setActiveView("tasks")}
          style={{
            fontSize: "20px",
            display: "block",
            width: "100%",
            marginBottom: "8px",
            background: activeView === "tasks" ? "#ddd" : "transparent",
          }}
        >
          Manage Tasks
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "1rem" }}>
        {activeView === "users" && <UserManagement />}
        {activeView === "tasks" && <TaskManagement />}
      </div>
    </div>
  );
}
