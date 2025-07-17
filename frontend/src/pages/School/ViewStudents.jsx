// src/pages/School/ViewStudents.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/ui/Navbar";

const ViewStudents = () => {
  const { authData } = useAuth();
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/students", {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students", error);
      alert("Failed to load students");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting student", error);
      alert("Error deleting student");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">All Students</h2>

        {students.length === 0 ? (
          <p className="text-gray-600">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="py-2 px-4 border">Photo</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Class</th>
                  <th className="py-2 px-4 border">Section</th>
                  <th className="py-2 px-4 border">Phone</th>
                  <th className="py-2 px-4 border">DOB</th>
                  <th className="py-2 px-4 border">Gender</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4 border">{student.name}</td>
                    <td className="py-2 px-4 border">{student.className}</td>
                    <td className="py-2 px-4 border">{student.section}</td>
                    <td className="py-2 px-4 border">{student.phone}</td>
                    <td className="py-2 px-4 border">
                      {new Date(student.dob).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{student.gender}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      {/* You can add View or Edit buttons here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudents;
