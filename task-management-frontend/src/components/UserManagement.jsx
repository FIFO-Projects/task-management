import { Routes, Route, Link } from "react-router-dom";
import CreateUser from "./users/CreateUser";
import ManageUser from "./users/ManageUser";
import AssignRole from "./users/AssignRole";

const UserManagement = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>User Management</h2>
      <div style={{ marginBottom: 20 }}>
        <Link to="create" style={{ marginRight: 10 }}>Create User</Link>
        <Link to="manage" style={{ marginRight: 10 }}>Manage User</Link>
        <Link to="assign-role" style={{ marginRight: 10 }}>Assign Role</Link>
      </div>

      <Routes>
        <Route path="create" element={<CreateUser />} />
        <Route path="manage" element={<ManageUser />} />
        <Route path="assign-role" element={<AssignRole />} />
      </Routes>
    </div>
  );
};

export default UserManagement;
