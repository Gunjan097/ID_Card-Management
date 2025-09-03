import Navbar from "../ui/Navbar";
import SchoolNav from "../ui/SchoolNav";

const SchoolLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar />

      {/* School Sub Navigation */}
      <SchoolNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default SchoolLayout;
