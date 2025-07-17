// src/components/forms/StudentForm.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const StudentForm = ({ initialData = {}, onSuccess, mode = "add" }) => {
  const { authData } = useAuth();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
    className: initialData.className || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    bloodGroup: initialData.bloodGroup || "",
    gender: initialData.gender || "",
    photo: null,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes", {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setClasses(res.data);
      } catch (err) {
        console.error("Error loading classes", err);
      }
    };
    fetchClasses();
  }, [authData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });

      const endpoint = mode === "edit" ? `/api/students/${initialData._id}` : "/api/students";
      const method = mode === "edit" ? "put" : "post";

      await axios[method](endpoint, data, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(`Student ${mode === "edit" ? "updated" : "added"} successfully`);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting student", error);
      alert("Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Student Name"
        required
        className="border p-2 rounded"
      />
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <select
        name="className"
        value={formData.className}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls._id} value={cls.className}>
            {cls.className}
          </option>
        ))}
      </select>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        required
        className="border p-2 rounded"
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
        className="border p-2 rounded"
      />
      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Select Blood Group (optional)</option>
        <option>A+</option>
        <option>A-</option>
        <option>B+</option>
        <option>B-</option>
        <option>O+</option>
        <option>O-</option>
        <option>AB+</option>
        <option>AB-</option>
      </select>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        name="photo"
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {mode === "edit" ? "Update" : "Submit"}
      </button>
    </form>
  );
};

export default StudentForm;
