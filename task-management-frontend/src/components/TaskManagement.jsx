import { Routes, Route, Link } from "react-router-dom";
import CreateTask from "./tasks/CreateTask";
import AssignTask from "./tasks/AssignTask";

const TaskManagement = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Task Management</h2>
      <div style={{ marginBottom: 20 }}>
        <Link to="create" style={{ marginRight: 10 }}>Create Task</Link>
        <Link to="assign">Assign Task</Link>
      </div>

      <Routes>
        <Route path="create" element={<CreateTask />} />
        <Route path="assign" element={<AssignTask />} />
      </Routes>
    </div>
  );
};

export default TaskManagement;
