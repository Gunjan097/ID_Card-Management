import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SchoolLayout from "../../components/layout/SchoolLayout";
import ImportStudents from "../../components/ImportStudents";
const ClassStudents = () => {
  const { className } = useParams();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [className]);

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get(`/api/students/class/${className}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudents(data.students);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = students.filter((s) =>
    search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
        s.uniqueId?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const exportCSV = () => {
    const headers = [
      "Name,Father,Mother,RollNo,Class,Gender,Aadhar,UniqueId,GRNo,RFIDNo,Phone1,Phone2,DOB",
    ];
    const rows = filteredStudents.map(
      (s) =>
        `${s.name},${s.fatherName || ""},${s.motherName || ""},${
          s.rollNo || ""
        },${s.className},${s.gender || ""},${s.aadharNumber || ""},${
          s.uniqueId || ""
        },${s.grNo || ""},${s.rfidNo || ""},${s.phone1 || ""},${
          s.phone2 || ""
        },${s.dob || ""}`
    );
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${className}_students.csv`;
    link.click();
  };

  // const handleImport = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     await axios.post("/api/students/import", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     fetchStudents();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`/api/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SchoolLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Students in Class {className}
        </h1>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
          <input
            type="text"
            placeholder="Search by name, roll no, or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2"
          />
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FiDownload /> Export
            </button>
            <ImportStudents onSuccess={fetchStudents} />
            <button
              onClick={() => navigate(`/school/add-student?class=${className}`)}
              className="bg-indigo-600 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FiPlus /> Add Student
            </button>
          </div>
        </div>

        {/* Student List */}
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Photo</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Roll No</th>
              <th className="border px-3 py-2">Gender</th>
              <th className="border px-3 py-2">Father</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id}>
                <td className="border px-3 py-2 align-middle">
                  {s.photo ? (
                    <img
                      src={s.photo}
                      alt={s.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Photo</span>
                  )}
                </td>
                <td className="border px-3 py-2 align-middle">{s.name}</td>
                <td className="border px-3 py-2 align-middle">{s.rollNo}</td>
                <td className="border px-3 py-2 align-middle">{s.gender}</td>
                <td className="border px-3 py-2 align-middle">{s.fatherName}</td>
                <td className="border px-3 py-2 align-middle">{s.phone1 || s.phone2}</td>
                <td className="border px-3 py-2 align-middle">
                  <div className="flex gap-2 justify-center">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => navigate(`/school/edit-student/${s._id}`)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(s._id)}
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SchoolLayout>
  );
};

export default ClassStudents;
