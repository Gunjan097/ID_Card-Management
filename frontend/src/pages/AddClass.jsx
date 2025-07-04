// src/pages/AddClass.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/ui/Navbar";

const AddClass = () => {
  const { authData } = useAuth();
  const [form, setForm] = useState({ className: "", section: "" });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/classes", form, {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setMessage("Class added successfully!");
      setForm({ className: "", section: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding class");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Add New Class</h2>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="className"
            placeholder="Class (e.g. 1, 2, 10)"
            value={form.className}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="section"
            placeholder="Section (e.g. A, B)"
            value={form.section}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
