// src/pages/EditStudent.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FormField from "../../components/form/FormField";

const EditStudent = () => {
  const { id } = useParams(); // student id from URL
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rollNo: "",
    className: "",
    gender: "",
    fatherName: "",
    motherName: "",
    aadharNumber: "",
    phone1: "",
    phone2: "",
    dob: "",
    uniqueId: "",
    grNo: "",
    rfidNo: "",
    photo: null,
  });

  // Fetch available classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data.classes);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  // Fetch student data by ID
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await axios.put(`/api/students/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student updated successfully");
      navigate(-1); // go back
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormField label="Roll No" name="rollNo" value={form.rollNo} onChange={handleChange} />

        <div className="flex items-center space-x-4">
          <label className="w-1/3 text-sm font-medium text-gray-700">Class</label>
          <select
            name="className"
            value={form.className}
            onChange={handleChange}
            className="flex-1 border p-2 rounded"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <label className="w-1/3 text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="flex-1 border p-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <FormField label="Father's Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
        <FormField label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} />
        <FormField label="Date of Birth" name="dob" type="date" value={form.dob?.split("T")[0] || ""} onChange={handleChange} />
        <FormField label="Phone 1" name="phone1" value={form.phone1} onChange={handleChange} />
        <FormField label="Phone 2" name="phone2" value={form.phone2} onChange={handleChange} />
        <FormField label="Aadhar Number" name="aadharNumber" value={form.aadharNumber} onChange={handleChange} />
        <FormField label="Unique ID" name="uniqueId" value={form.uniqueId} onChange={handleChange} />
        <FormField label="GR No" name="grNo" value={form.grNo} onChange={handleChange} />
        <FormField label="RFID No" name="rfidNo" value={form.rfidNo} onChange={handleChange} />

        <div className="flex items-center space-x-4">
          <label className="w-1/3 text-sm font-medium text-gray-700">Photo</label>
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className="flex-1 border p-2 rounded" />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Update Student
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
