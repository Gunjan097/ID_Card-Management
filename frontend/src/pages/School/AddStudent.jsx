import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/ui/Navbar";
import axios from "axios";

const AddStudent = () => {
  const { authData } = useAuth();
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "", 
    className: "",
    section: "",
    phone: "",
    address: "",
    bloodGroup: "",
    photo: null,
});


  
  // Load classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes", {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
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
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      const res = await axios.post("/api/students", data, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student added successfully");
      setFormData({
        name: "",
        dob: "",
        className: "",
        section: "",
        phone: "",
        gender: "",
        address: "",
        bloodGroup: "",
        photo: null,
      });
    } catch (error) {
      console.error("Error submitting student", error);
      alert("Error adding student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Add New Student</h2>

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

          <input
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="Section"
            required
            className="border p-2 rounded"
          />

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

          {/* Photo Upload with Camera */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            name="photo"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
