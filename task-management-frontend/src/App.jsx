import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Role selection & login
import RoleSelection from "./components/RoleSelection";
import SuperAdminLogin from "./components/SuperAdminLogin";
import TenantAdminLogin from "./components/tenantAdmin/TenantAdminLogin";
import SubordinateLogin from "./components/subordinate/SubordinateLogin";

// Dashboards
import TenantManagement from "./components/TenantManagement"; // Super Admin
import TenantAdminDashboard from "./components/tenantAdmin/TenantAdminDashboard";
import SubordinateDashboard from "./components/subordinate/SubordinateDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Role Selection & Login */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login/SUPER_ADMIN" element={<SuperAdminLogin />} />
        <Route path="/login/TENANT_ADMIN" element={<TenantAdminLogin />} />
        <Route path="/login/SUBORDINATE" element={<SubordinateLogin />} />

        {/* Super Admin Dashboard */}
        <Route path="/dashboard" element={<TenantManagement />} />

        {/* Tenant Admin Dashboard */}
        <Route path="/tenant-admin" element={<TenantAdminDashboard />} />

        {/* Subordinate Dashboard */}
        <Route path="/subordinate" element={<SubordinateDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
