import Navbar from "../components/ui/Navbar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reusable Top Navbar */}
      <Navbar />
      

      {/* Dashboard Content Area */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, Admin</h2>

        <p className="text-gray-600 mb-4">
          This is your admin dashboard. You can manage schools and permissions.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Add School</h3>
            <p className="text-sm text-gray-600">
              Add new schools under your administration. Control their credentials and access.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">View Schools</h3>
            <p className="text-sm text-gray-600">
              See the list of schools, edit their information, or remove them if necessary.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Export Data</h3>
            <p className="text-sm text-gray-600">
              Export student/teacher ID data from any school (if permitted).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
