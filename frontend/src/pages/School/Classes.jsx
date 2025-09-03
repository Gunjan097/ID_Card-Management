import { useEffect, useState } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token"); // stored at login
        const res = await axios.get("http://localhost:5000/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes", err);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Classes</h1>
      {classes.length === 0 ? (
        <p className="text-gray-500">No classes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white p-4 shadow rounded-lg border hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium">{cls.className}</h2>
              <p className="text-sm text-gray-600">
                Students: {cls.studentCount || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classes;
