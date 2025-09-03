import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SchoolLayout from "../../components/layout/SchoolLayout";

const SchoolDashboard = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

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

  return (
    <SchoolLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">School Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer flex justify-between items-center"
              onClick={() => navigate(`/school/class/${cls}`)}
            >
              <span className="font-semibold">{cls}</span>
              <FiEdit className="text-gray-500" />
            </div>
          ))}
        </div>
      </div>
    </SchoolLayout>
  );
};

export default SchoolDashboard;
