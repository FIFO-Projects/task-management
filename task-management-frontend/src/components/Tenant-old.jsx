import React, { useState, useEffect } from "react";
import axios from "axios";

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantAdminId, setNewTenantAdminId] = useState("");

  const [updateTenantName, setUpdateTenantName] = useState("");
  const [updateTenantAdminId, setUpdateTenantAdminId] = useState("");

  const token = localStorage.getItem("token"); // get JWT token

  // Fetch tenants & users
  useEffect(() => {
    fetchTenants();
    fetchUsers();
  }, []);

  const fetchTenants = async () => {
    const res = await axios.get("http://localhost:8080/api/tenants", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTenants(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8080/api/users", { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    setUsers(res.data);
  };

  // --- CREATE ---
  const handleCreateTenant = async () => {
    if (!newTenantName || !newTenantAdminId) return alert("Fill all fields");
    await axios.post(
      "http://localhost:8080/api/tenants",
      { name: newTenantName, tenantAdminId: newTenantAdminId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewTenantName("");
    setNewTenantAdminId("");
    fetchTenants();
  };

  // --- UPDATE ---
  const handleSelectTenant = (tenant) => {
    setSelectedTenant(tenant);
    setUpdateTenantName(tenant.name);
    // find admin id from users list
    const adminUser = users.find(u => u.username === tenant.tenantAdminName);
    setUpdateTenantAdminId(adminUser?.id || "");
  };

  const handleUpdateTenant = async () => {
    if (!selectedTenant) return alert("Select a tenant first");
    await axios.put(
      `http://localhost:8080/api/tenants/${selectedTenant.id}`,
      { name: updateTenantName, tenantAdminId: updateTenantAdminId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSelectedTenant(null);
    setUpdateTenantName("");
    setUpdateTenantAdminId("");
    fetchTenants();
  };

  // --- DELETE ---
  const handleDeleteTenant = async (id) => {
    if (window.confirm("Are you sure to delete this tenant?")) {
      await axios.delete(`http://localhost:8080/api/tenants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTenants();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tenant Management</h2>

      {/* CREATE */}
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Create New Tenant</h3>
        <label>Tenant Name:</label>
        <input value={newTenantName} onChange={(e) => setNewTenantName(e.target.value)} />
        <br />
        <label>Tenant Admin:</label>
        <select value={newTenantAdminId} onChange={(e) => setNewTenantAdminId(e.target.value)}>
          <option value="">Select Admin</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
        <br />
        <button onClick={handleCreateTenant}>Create Tenant</button>
      </div>

      {/* UPDATE */}
      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Update Tenant</h3>
        <label>Select Tenant:</label>
        <select onChange={(e) => handleSelectTenant(JSON.parse(e.target.value))}>
          <option value="">Select Tenant</option>
          {tenants.map(t => (
            <option key={t.id} value={JSON.stringify(t)}>
              {t.name} ({t.tenantAdminName})
            </option>
          ))}
        </select>
        {selectedTenant && (
          <>
            <br />
            <label>Tenant Name:</label>
            <input value={updateTenantName} onChange={(e) => setUpdateTenantName(e.target.value)} />
            <br />
            <label>Tenant Admin:</label>
            <select value={updateTenantAdminId} onChange={(e) => setUpdateTenantAdminId(e.target.value)}>
              <option value="">Select Admin</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
            <br />
            <button onClick={handleUpdateTenant}>Update Tenant</button>
          </>
        )}
      </div>

      {/* DELETE */}
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h3>Delete Tenant</h3>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tenant Name</th>
              <th>Tenant Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.tenantAdminName}</td>
                <td>
                  <button onClick={() => handleDeleteTenant(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TenantManagement;

