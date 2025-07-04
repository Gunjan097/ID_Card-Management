// src/pages/SuperAdminDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/ui/Navbar";
import axios from "axios";

const SuperAdminDashboard = () => {
  const { authData, logout } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [schools, setSchools] = useState([]);

  // Fetch Admins & Schools
  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminRes = await axios.get("/api/superadmin/admins", {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        const schoolRes = await axios.get("/api/superadmin/schools", {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setAdmins(adminRes.data);
        setSchools(schoolRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    if (authData?.token) {
      fetchData();
    }
  }, [authData?.token]);

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Delete this Admin?")) {
      try {
        await axios.delete(`/api/superadmin/admin/${id}`, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setAdmins((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        alert("Error deleting admin");
      }
    }
  };

  const handleDeleteSchool = async (id) => {
    if (window.confirm("Delete this School?")) {
      try {
        await axios.delete(`/api/superadmin/school/${id}`, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setSchools((prev) => prev.filter((s) => s._id !== id));
      } catch (err) {
        alert("Error deleting school");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />
      {/* <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Super Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{authData?.user?.email}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav> */}

      <div className="p-6">
        {/* Admins */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Admins</h2>
          {admins.length === 0 ? (
            <p className="text-sm text-gray-500">No admins found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="p-2">Username</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-t text-sm">
                      <td className="p-2">{admin.username}</td>
                      <td className="p-2">{admin.email}</td>
                      <td className="p-2">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteAdmin(admin._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Schools */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Schools</h2>
          {schools.length === 0 ? (
            <p className="text-sm text-gray-500">No schools found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school._id} className="border-t text-sm">
                      <td className="p-2">{school.schoolName}</td>
                      <td className="p-2">{school.email}</td>
                      <td className="p-2">{school.phoneNumber}</td>
                      <td className="p-2">
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDeleteSchool(school._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
