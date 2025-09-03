import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash, FiUpload, FiDownload, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SchoolLayout from "../../components/layout/SchoolLayout";
import ImportStudents from "../../components/ImportStudents";

const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchStudents();
  }, [page, search, selectedClass]); // refetch on filter change

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get("/api/students", {
        params: { page, limit, search, className: selectedClass },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudents(data.students);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get("/api/classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses(data.classes);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Filter students by class + search
  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClass ? s.className === selectedClass : true;
    const matchesSearch = search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
      s.uniqueId?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesClass && matchesSearch;
  });


  // ✅ Export CSV

  const exportCSV = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/api/students/export", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob", // important for files
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.xlsx");
    document.body.appendChild(link);
    link.click();
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export students");
  }
};

  

  // ✅ Import CSV
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

  // ✅ Delete student
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
        {/* Header actions */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
          <div className="flex gap-3">
            <select
              className="border rounded p-2"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map((cls, idx) => (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Search by name, roll no, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded p-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="bg-green-500 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FiDownload /> Export
            </button>

             <ImportStudents onSuccess={fetchStudents} />
            <button
              onClick={() => navigate("/school/add-student/")}
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
              <th className="border px-3 py-2">Class</th>
              <th className="border px-3 py-2">Gender</th>
              <th className="border px-3 py-2">Father</th>
              <th className="border px-3 py-2">Mother</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">DOB</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredStudents.map((s) => (
    <tr key={s._id} className="hover:bg-gray-50">
      {/* Photo */}
      <td className="border px-3 py-2">
        {s.photo ? (
          <img
            src={s.photo}
            alt={s.name}
            className="w-16 h-16 object-cover rounded-lg shadow-sm"
          />
        ) : (
          <span className="text-gray-400">No Photo</span>
        )}
      </td>

      {/* Basic Info */}
      <td className="border px-3 py-2">{s.name}</td>
      <td className="border px-3 py-2">{s.rollNo}</td>
      <td className="border px-3 py-2">{s.className}</td>
      <td className="border px-3 py-2">{s.gender}</td>
      <td className="border px-3 py-2">{s.fatherName}</td>
      <td className="border px-3 py-2">{s.motherName}</td>
      <td className="border px-3 py-2">{s.phone1 || s.phone2}</td>
      <td className="border px-3 py-2">{s.dob}</td>

      {/* Actions */}
      <td className="border px-3 py-2">
        <div className="flex justify-center gap-3 items-center">
          <button
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
            onClick={() => navigate(`/school/edit-student/${s._id}`)}
          >
            <FiEdit size={18} />
          </button>
          <button
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
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

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          {/* Showing count */}
          <p className="text-gray-600">
            Showing {(page - 1) * limit + 1} – {(page - 1) * limit + students.length} of {total} students
          </p>

          {/* Page buttons */}
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-1 rounded border ${page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Prev
            </button>

            {/* Numbered pages */}
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded border ${page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-1 rounded border ${page === pages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>
        </div>


      </div>
    </SchoolLayout>
  );
};

export default Students;
