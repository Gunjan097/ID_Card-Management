import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ClassView = () => {
  const { className } = useParams();
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/students/class/${className}?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setStudents(data.students);
        setTotal(data.total);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [className, page, limit, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await fetch(`/api/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(students.filter((s) => s._id !== id));
      setTotal(total - 1);
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Class {className} ({total} Students)
      </h1>

      <div className="flex gap-2 mb-4">
        <Link
          to={`/school/add-student/${className}`}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕ Add Student
        </Link>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          🗑 Remove All Students
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          📥 Import CSV
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          📤 Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found in this class.</p>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <div
              key={student._id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <div className="flex items-center gap-3">
                <img
                  src={student.photo}
                  alt="student"
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-gray-600">
                    Roll No: {student.rollNo} | GR No: {student.grNo}
                  </p>
                  <p className="text-sm text-gray-600">
                    Father: {student.fatherName} | Mother: {student.motherName}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/school/edit-student/${student._id}`}
                  className="text-blue-500"
                >
                  ✏ Edit
                </Link>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="text-red-500"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClassView;
