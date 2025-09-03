import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormField from "../../components/form/FormField";

const AddStudent = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  
  const [loading, setLoading] = useState(false); 

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await axios.post("/api/students", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student added successfully");
      navigate("/school/students");
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student");
    }
     finally {
      setLoading(false); // re-enable button
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} />
        <FormField label="Roll No" name="rollNo" value={form.rollNo} onChange={handleChange} />
        <FormField
          label="Class"
          name="className"
          type="select"
          value={form.className}
          onChange={handleChange}
          options={classes}
        />
        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={form.gender}
          onChange={handleChange}
          options={["Male", "Female", "Other"]}
        />
        <FormField label="Father's Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
        <FormField label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} />
        <FormField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
        <FormField label="Phone 1" name="phone1" value={form.phone1} onChange={handleChange} />
        <FormField label="Phone 2" name="phone2" value={form.phone2} onChange={handleChange} />
        <FormField label="Aadhar Number" name="aadharNumber" value={form.aadharNumber} onChange={handleChange} />
        <FormField label="Unique ID" name="uniqueId" value={form.uniqueId} onChange={handleChange} />
        <FormField label="GR No" name="grNo" value={form.grNo} onChange={handleChange} />
        <FormField label="RFID No" name="rfidNo" value={form.rfidNo} onChange={handleChange} />
        <FormField label="Photo" name="photo" type="file" accept="image/*" onChange={handleFileChange} />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
