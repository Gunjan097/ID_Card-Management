// src/pages/School/ViewClasses.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../../components/ui/Navbar";

const ViewClasses = () => {
  const { authData } = useAuth();
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        // Sort className alphabetically (case-insensitive)
        const sorted = res.data.sort((a, b) =>
          a.className.toLowerCase().localeCompare(b.className.toLowerCase())
        );

        setClasses(sorted);
      } catch (err) {
        console.error("Error fetching classes", err);
      }
    };

    fetchClasses();
  }, [authData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Your Classes</h2>
          <div className="flex gap-3">
            <Link
              to="/school/add-class"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Class
            </Link>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Remove All
            </button>
          </div>
        </div>

        {classes.length === 0 ? (
          <p className="text-gray-600">No classes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded shadow p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <Link
                    to={`/school/class/${encodeURIComponent(cls.className)}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {cls.className}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {cls.studentCount || 0} Students
                  </span>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
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

export default ViewClasses;