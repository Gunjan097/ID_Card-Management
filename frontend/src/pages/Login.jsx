import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [role, setRole] = useState("admin"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  const getLoginUrl = (role) => {
    if (role === "admin") return "/api/auth/admin-login";
    if (role === "school") return "/api/auth/school-login";
    return "/api/auth/superadmin/login";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(getLoginUrl(role), {
        email,
        password,
      });

      const { token, user } = response.data;
      setAuthData({ token, user });

      if (user.role === "Admin") navigate("/admin/dashboard");
      else if (user.role === "School") navigate("/school/dashboard");
      else if (user.role === "SuperAdmin") navigate("/superadmin");
    } catch (err) {
      setError(err.response?.data?.message || "role not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Login
        </h2>

        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              role === "admin" ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              role === "school" ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setRole("school")}
          >
            School
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
