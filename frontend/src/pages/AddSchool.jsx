import { useState } from "react";
import Navbar from "../components/ui/Navbar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const AddSchool = () => {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    schoolName: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await axios.post(
        "/api/schools",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`
          }
        }
      );
      setMessage({ type: "success", text: res.data.message });
      setFormData({ schoolName: "", address: "", phoneNumber: "", email: "", password: "" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Something went wrong"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New School</h2>

        {message && (
          <div
            className={`p-3 mb-4 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="schoolName"
            type="text"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="phoneNumber"
            type="text"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="School Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Set Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Create School
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSchool;
