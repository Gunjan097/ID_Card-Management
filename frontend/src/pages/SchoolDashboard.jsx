// src/pages/SchoolDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/ui/Navbar";

const SchoolDashboard = () => {
  const { authData } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          Welcome, {authData?.user?.email}
        </h2>
        <p className="mb-6 text-gray-700">
          This is your School Dashboard. You can manage your classes and students.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/school/add-class"
            className="bg-blue-600 text-white px-4 py-3 rounded shadow hover:bg-blue-700 text-center"
          >
            ➕ Add Class
          </Link>

          <Link
            to="/school/view-classes"
            className="bg-green-600 text-white px-4 py-3 rounded shadow hover:bg-green-700 text-center"
          >
            📚 View Classes
          </Link>

          {/* You can add more features here later */}
          <Link
            to="/school/add-student"
            className="bg-purple-600 text-white px-4 py-3 rounded shadow hover:bg-purple-700 text-center"
          >
            🧑‍🎓 Add Student
          </Link>

          <Link
            to="/school/view-students"
            className="bg-yellow-500 text-white px-4 py-3 rounded shadow hover:bg-yellow-600 text-center"
          >
            📋 View Students
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
