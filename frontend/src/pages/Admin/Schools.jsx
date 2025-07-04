// src/pages/Admin/Schools.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Schools = () => {
  const { authData } = useAuth();
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    schoolName: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 Fetch all schools on mount
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await axios.get("/api/schools", {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setSchools(res.data);
    } catch (err) {
      setError("Failed to fetch schools");
    }
  };

  // ✅ Submit form to create school
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/schools", formData, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      setFormData({
        schoolName: "",
        address: "",
        phoneNumber: "",
        email: "",
        password: "",
      });
      fetchSchools(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Error creating school");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (schoolId) => {
    if (!window.confirm("Are you sure to delete this school?")) return;

    try {
      await axios.delete(`/api/schools/${schoolId}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      fetchSchools(); // Refresh list
    } catch (err) {
      setError("Failed to delete school");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Manage Schools</h1>

      {/* 🔵 Add School Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 mb-8 grid gap-4 md:grid-cols-2"
      >
        <input
          type="text"
          placeholder="School Name"
          value={formData.schoolName}
          onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="input"
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="School Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="School Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="input"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded col-span-2 hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Add School"}
        </button>
      </form>

      {/* 🔴 Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* 📋 School List Table */}
      <div className="bg-white shadow rounded overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">School Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Phone</th>
              <th className="text-left px-4 py-2">Address</th>
              {authData.user.permissions?.manageSchools && (
                <th className="text-left px-4 py-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school._id} className="border-b">
                <td className="px-4 py-2">{school.schoolName}</td>
                <td className="px-4 py-2">{school.email}</td>
                <td className="px-4 py-2">{school.phoneNumber}</td>
                <td className="px-4 py-2">{school.address}</td>
                {authData.user.permissions?.manageSchools && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(school._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schools;
