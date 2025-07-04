import { useAuth } from "../context/AuthContext";

const SchoolDashboard = () => {
  const { authData, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-blue-600">School Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{authData?.user?.email}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {authData?.user?.email}</h2>
        <p>This is your school dashboard. You can manage classes and students.</p>
      </div>
    </div>
  );
};

export default SchoolDashboard;
