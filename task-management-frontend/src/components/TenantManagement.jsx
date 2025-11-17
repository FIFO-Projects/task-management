// src/components/TenantManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TenantManagement.css";

const TenantManagement = () => {
  const [view, setView] = useState(""); // "create", "update", "delete", "list"
  const [tenants, setTenants] = useState([]);
  const [users, setUsers] = useState([]);

  // create tenant
  const [newTenantName, setNewTenantName] = useState("");
  const [useExistingAdmin, setUseExistingAdmin] = useState(true);
  const [newTenantAdminId, setNewTenantAdminId] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  // update tenant
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [updateTenantName, setUpdateTenantName] = useState("");
  const [updateTenantAdminId, setUpdateTenantAdminId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTenants();
    fetchUsers();
  }, []);

  const fetchTenants = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tenants", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // CREATE TENANT
  const handleCreateTenant = async () => {
    if (!newTenantName) return alert("Enter tenant name");

    try {
      if (useExistingAdmin) {
        // just link to an existing admin user
        if (!newTenantAdminId) return alert("Select an admin user");
        await axios.post(
          "http://localhost:8080/api/tenants",
          {
            name: newTenantName,
            tenantAdminId: newTenantAdminId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Tenant Created Successfully!");
      } else {
        // create new admin + tenant in one go using your /create-with-admin
        if (!newAdminUsername || !newAdminPassword)
          return alert("Enter new admin username and password");

        await axios.post(
          "http://localhost:8080/api/tenants/create-with-admin",
          {
            tenantName: newTenantName,
            adminUsername: newAdminUsername,
            adminPassword: newAdminPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Tenant and Admin Created Successfully!");
      }

      // reset fields and refresh lists
      setNewTenantName("");
      setNewTenantAdminId("");
      setNewAdminUsername("");
      setNewAdminPassword("");
      setUseExistingAdmin(true);
      fetchTenants();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed: " + (err.response?.data || err.message));
    }
  };

  // UPDATE
  const handleSelectTenant = (tenant) => {
    setSelectedTenant(tenant);
    setUpdateTenantName(tenant.name);
    const adminUser = users.find((u) => u.username === tenant.tenantAdminName);
    setUpdateTenantAdminId(adminUser?.id || "");
  };

  const handleUpdateTenant = async () => {
    if (!selectedTenant) return alert("Select a tenant first");
    await axios.put(
      `http://localhost:8080/api/tenants/${selectedTenant.id}`,
      {
        name: updateTenantName,
        tenantAdminId: updateTenantAdminId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSelectedTenant(null);
    setUpdateTenantName("");
    setUpdateTenantAdminId("");
    fetchTenants();
    alert("Tenant Updated Successfully!");
  };

  // DELETE
  const handleDeleteTenant = async (id) => {
    if (window.confirm("Are you sure to delete this tenant?")) {
      await axios.delete(`http://localhost:8080/api/tenants/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTenants();
      alert("Tenant Deleted Successfully!");
    }
  };

  return (
    <div className="tenant-container">
      <h2 className="tenant-title">TENANT MANAGEMENT DASHBOARD</h2>

      {/* Buttons */}
      <div className="tenant-button-container">
        <div className="tenant-button-group">
          <button className="tenant-btn" onClick={() => setView("create")}>
            Create New Tenant
          </button>
          <button className="tenant-btn" onClick={() => setView("update")}>
            Update Tenant
          </button>
          <button className="tenant-btn" onClick={() => setView("delete")}>
            Delete Tenant
          </button>
          <button className="tenant-btn" onClick={() => setView("list")}>
            Existing Tenants
          </button>
        </div>
      </div>

      {/* CREATE */}
      {view === "create" && (
        <div className="tenant-form">
          <h3 className="form-title">Create New Tenant</h3>
          <label className="form-label">Tenant Name:</label>
          <input
            className="form-input"
            value={newTenantName}
            onChange={(e) => setNewTenantName(e.target.value)}
          />

          <div className="admin-toggle">
            <label>
              <input
                type="radio"
                checked={useExistingAdmin}
                onChange={() => setUseExistingAdmin(true)}
              />{" "}
              Use Existing Admin
            </label>
            <label>
              <input
                type="radio"
                checked={!useExistingAdmin}
                onChange={() => setUseExistingAdmin(false)}
              />{" "}
              Register New Admin
            </label>
          </div>

          {useExistingAdmin ? (
            <>
              <label className="form-label">Select Tenant Admin:</label>
              <select
                className="form-select"
                value={newTenantAdminId}
                onChange={(e) => setNewTenantAdminId(e.target.value)}
              >
                <option value="">Select Admin</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label className="form-label">New Admin Username:</label>
              <input
                className="form-input"
                value={newAdminUsername}
                onChange={(e) => setNewAdminUsername(e.target.value)}
              />
              <label className="form-label">New Admin Password:</label>
              <input
                type="password"
                className="form-input"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
              />
              <p className="form-note">
                Role will be automatically set to <b>TENANT_ADMIN</b>
              </p>
            </>
          )}
          <button className="form-submit-btn" onClick={handleCreateTenant}>
            Create Tenant
          </button>
        </div>
      )}

      {/* UPDATE */}
      {view === "update" && (
        <div className="tenant-form">
          <h3 className="form-title">Update Tenant</h3>
          <label className="form-label">Select Tenant:</label>
          <select
            className="form-select"
            onChange={(e) => handleSelectTenant(JSON.parse(e.target.value))}
          >
            <option value="">Select Tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={JSON.stringify(t)}>
                {t.name} ({t.tenantAdminName})
              </option>
            ))}
          </select>
          {selectedTenant && (
            <>
              <label className="form-label">Tenant Name:</label>
              <input
                className="form-input"
                value={updateTenantName}
                onChange={(e) => setUpdateTenantName(e.target.value)}
              />
              <label className="form-label">Tenant Admin:</label>
              <select
                className="form-select"
                value={updateTenantAdminId}
                onChange={(e) => setUpdateTenantAdminId(e.target.value)}
              >
                <option value="">Select Admin</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
              <button className="form-submit-btn" onClick={handleUpdateTenant}>
                Update Tenant
              </button>
            </>
          )}
        </div>
      )}

      {/* DELETE */}
      {view === "delete" && (
        <div className="tenant-table-container">
          <h3>Delete Tenant</h3>
          <table className="tenant-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tenant Name</th>
                <th>Tenant Admin</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.tenantAdminName}</td>
                  <td>
                    <button onClick={() => handleDeleteTenant(t.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LIST */}
      {view === "list" && (
        <div className="tenant-table-container">
          <h3>Existing Tenants</h3>
          <table className="tenant-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tenant Name</th>
                <th>Tenant Admin</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.tenantAdminName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
