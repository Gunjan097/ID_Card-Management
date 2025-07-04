import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/ui/Navbar";
import { useAuth } from "../context/AuthContext";

const ViewSchools = () => {
  const { authData } = useAuth();
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);

  const fetchSchools = async () => {
    try {
      const res = await axios.get("/api/schools", {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });
      setSchools(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching schools");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this school?")) return;

    try {
      await axios.delete(`/api/schools/${id}`, {
        headers: {
          Authorization: `Bearer ${authData?.token}`,
        },
      });
      setSchools(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert("Error deleting school");
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">All Registered Schools</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full border text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">School Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Address</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school._id} className="border-b">
                  <td className="p-2">{school.schoolName}</td>
                  <td className="p-2">{school.email}</td>
                  <td className="p-2">{school.phoneNumber}</td>
                  <td className="p-2">{school.address}</td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(school._id)}
                    >
                      Delete
                    </button>
                    {/* Edit button can be added later */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {schools.length === 0 && (
            <p className="text-gray-600 mt-4 text-center">No schools found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSchools;
