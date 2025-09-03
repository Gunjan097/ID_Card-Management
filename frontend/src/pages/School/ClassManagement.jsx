import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/ui/Navbar";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SchoolLayout from "../../components/layout/SchoolLayout";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddOrUpdateClass = async () => {
    if (!className.trim()) return alert("Class name is required");

    try {
      const token = localStorage.getItem("token");

      if (editingClass) {
        await axios.put(
          `/api/classes/${encodeURIComponent(editingClass)}`,
          { newName: className },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/api/classes",
          { className },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setClassName("");
      setEditingClass(null);
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving class");
    }
  };

  const handleEdit = (cls) => {
    setClassName(cls);
    setEditingClass(cls);
  };

  const handleDelete = async (cls) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/classes/${encodeURIComponent(cls)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClasses();
    } catch (err) {
      console.error(err);
      alert("Error deleting class");
    }
  };

  return (
    <SchoolLayout>
    <div>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Class Management</h1>

        {/* Add / Edit Class */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter class name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddOrUpdateClass}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingClass ? "Update" : "Add"}
          </button>
          {editingClass && (
            <button
              onClick={() => {
                setClassName("");
                setEditingClass(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {/* List Classes */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p className="mb-2">Total Classes: {classes.length}</p>
            <ul className="border rounded divide-y">
              {classes.map((cls, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-2 hover:bg-gray-50"
                  onClick={() => navigate(`/school/class/${encodeURIComponent(cls)}`)}
                >
                  <span
                    className="cursor-pointer text-blue-600"
                  >
                    {cls}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="text-blue-500"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(cls)}
                      className="text-red-500"
                    >
                      <FiTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </SchoolLayout>
  );
};

export default ClassManagement;
