import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/ui/Navbar";
import axios from "axios";

const EditStudent = () => {
  const { authData } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    className: "",
    phone: "",
    address: "",
    bloodGroup: "",
    section: "",
    photo: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, classRes] = await Promise.all([
          axios.get(`/api/students/${id}`, {
            headers: { Authorization: `Bearer ${authData.token}` },
          }),
          axios.get(`/api/classes`, {
            headers: { Authorization: `Bearer ${authData.token}` },
          }),
        ]);

        const student = studentRes.data;
        setFormData({
          ...student,
          dob: student.dob.split("T")[0], // remove time
          photo: null, // don't preload file
        });
        setClasses(classRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    fetchData();
  }, [authData, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "photo" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        if (formData[key] !== null) data.append(key, formData[key]);
      }

      await axios.put(`/api/students/${id}`, data, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student updated");
      navigate(`/school/class/${formData.className}`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Edit Student</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input name="name" value={formData.name} onChange={handleChange} required className="border p-2 rounded" placeholder="Name" />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="border p-2 rounded" />
          <input name="phone" value={formData.phone} onChange={handleChange} required className="border p-2 rounded" placeholder="Phone" />
          <input name="address" value={formData.address} onChange={handleChange} required className="border p-2 rounded" placeholder="Address" />
          <select name="gender" value={formData.gender} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <select name="className" value={formData.className} onChange={handleChange} required className="border p-2 rounded">
            <option value="">Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls.className}>{cls.className}</option>
            ))}
          </select>
          <input name="section" value={formData.section} onChange={handleChange} placeholder="Section" className="border p-2 rounded" />
          <input name="bloodGroup" value={formData.bloodGroup || ""} onChange={handleChange} placeholder="Blood Group" className="border p-2 rounded" />
          <input type="file" name="photo" onChange={handleChange} className="border p-2 rounded" accept="image/*" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Student</button>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
