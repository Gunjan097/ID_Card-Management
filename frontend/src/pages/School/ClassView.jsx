import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/ui/Navbar";
import { useAuth } from "../../context/AuthContext";
import { FaTrash, FaEdit } from "react-icons/fa";

const ClassView = () => {
  const { className } = useParams();
  const { authData } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/students/class/${className}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [className]);

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  const handleAddStudent = () => navigate("/school/add-student");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-blue-700">
            Class: {className.toUpperCase()}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleAddStudent}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Student
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Remove All Students
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Import
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              Export
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-gray-600">No students found in this class.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="bg-white rounded shadow p-4 flex flex-col"
              >
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <h2 className="font-semibold text-lg text-gray-800">{student.name}</h2>
                <p className="text-sm text-gray-600">Gender: {student.gender}</p>
                <p className="text-sm text-gray-600">DOB: {new Date(student.dob).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Phone: {student.phone}</p>
                <p className="text-sm text-gray-600">Blood Group: {student.bloodGroup || "N/A"}</p>
                <div className="flex gap-3 mt-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="text-red-600 hover:text-red-800"
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

export default ClassView;
