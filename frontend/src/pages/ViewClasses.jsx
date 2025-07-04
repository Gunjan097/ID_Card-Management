// src/pages/ViewClasses.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import { useAuth } from "../context/AuthContext";

const ViewClasses = () => {
  const { authData } = useAuth();
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/api/classes", {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await axios.delete(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setClasses((prev) => prev.filter((cls) => cls._id !== id));
    } catch (err) {
      alert("Error deleting class");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Classes</h2>
        {classes.length === 0 ? (
          <p className="text-gray-600">No classes found.</p>
        ) : (
          <table className="w-full border text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Class</th>
                <th className="p-2">Section</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id} className="border-b">
                  <td className="p-2">{cls.className}</td>
                  <td className="p-2">{cls.section}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(cls._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {/* Future: Add 'Edit' */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewClasses;
