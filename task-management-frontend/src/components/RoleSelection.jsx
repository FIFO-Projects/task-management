import React from "react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    // For now, just log and navigate to login page (we’ll create later)
    console.log("Selected role:", role);
    navigate(`/login/${role}`); // route will depend on role
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>TASK MANAGEMENT</h1>
      <h2 style={{ marginTop: "20px", marginBottom: "40px" }}>SELECT YOUR ROLE</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "200px", margin: "0 auto" }}>
        <button onClick={() => handleRoleClick("SUPER_ADMIN")} style={buttonStyle}>Super Admin</button>
        <button onClick={() => handleRoleClick("TENANT_ADMIN")} style={buttonStyle}>Tenant Admin</button>
        <button onClick={() => handleRoleClick("SUBORDINATE")} style={buttonStyle}>Subordinate</button>
      </div>
    </div>
  );
};

// Basic button styling
const buttonStyle = {
  padding: "15px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#f0f0f0"
};

export default RoleSelection;
