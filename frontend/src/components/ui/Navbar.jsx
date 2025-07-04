// src/components/ui/Navbar.jsx
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { authData, logout } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-blue-600">
        {authData?.user?.role} Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">
          {authData?.user?.email}
        </span>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
