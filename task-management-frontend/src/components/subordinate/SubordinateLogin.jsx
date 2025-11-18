import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const SubordinateLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Use api.post instead of axios.post
      const response = await api.post("/auth/login", {
        username,
        password
      });

      console.log("Login response:", response.data);

      const user = {
        username: response.data.username,
        role: response.data.role,
        id: response.data.id || null
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "SUBORDINATE") {
        navigate("/subordinate");
      } else {
        setError("You are not authorized to access this page");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
    }
  };

  const displayRole = role ? role.split("_").join(" ") : "Subordinate";

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{displayRole} Login</h2>
      <form
        style={{ display: "inline-block", textAlign: "left", marginTop: "20px" }}
        onSubmit={handleLogin}
      >
        <label>Username</label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <label>Password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default SubordinateLogin;
