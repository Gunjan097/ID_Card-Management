import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/ui/Navbar";
import { FaTrash, FaEdit } from "react-icons/fa";

const SchoolDashboard = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/api/classes", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const sorted = res.data.sort((a, b) =>
        a.className.localeCompare(b.className, undefined, { sensitivity: "base" })
      );
      setClasses(sorted);
    } catch (err) {
      console.error("Error fetching classes", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    if (!newClassName.trim()) return alert("Enter class name");

    try {
      await axios.post(
        "/api/classes",
        { className: newClassName },
        { headers: { Authorization: `Bearer ${authData.token}` } }
      );
      setNewClassName("");
      fetchClasses();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add class");
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Delete this class and all its students?")) return;
    try {
      await axios.delete(`/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      fetchClasses();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleViewClass = (className) => {
    navigate(`/school/class/${className}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">School Dashboard</h1>

        <div className="flex gap-3 mb-4">
          <input
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter new class name"
            className="border rounded p-2 w-full sm:w-1/2"
          />
          <button
            onClick={handleAddClass}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Class
          </button>
        </div>

        {classes.length === 0 ? (
          <p className="text-gray-600">No classes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded shadow p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => handleViewClass(cls.className)}
              >
                <h2 className="font-semibold text-lg text-blue-800">
                  {cls.className.toUpperCase()}
                </h2>
                <p className="text-sm text-gray-600">
                  Students: {cls.studentCount || 0}
                </p>
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Edit class coming soon!");
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClass(cls._id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolDashboard;
