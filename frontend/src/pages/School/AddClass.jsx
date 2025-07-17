// src/pages/School/AddClass.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/ui/Navbar";

const AddClass = () => {
  const { authData } = useAuth();
  const [className, setClassName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "/api/classes",
        { className },
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      alert("Class added successfully");
      setClassName("");
    } catch (err) {
      console.error("Error creating class", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Add New Class</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="className"
            placeholder="Enter Class (e.g. 3A, Prep)"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
