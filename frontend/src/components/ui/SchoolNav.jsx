import { NavLink } from "react-router-dom";

const SchoolNav = () => {
  const links = [
    { name: "Students", path: "/school/students" },
    { name: "Orders", path: "/school/orders" },
    { name: "Systems", path: "/school/systems" },
    { name: "Notifications", path: "/school/notifications" },
    { name: "Reports", path: "/school/reports" },
    { name: "School Settings", path: "/school/settings" },
    { name: "Staff", path: "/school/staff" },
    { name: "Users", path: "/school/users" },
    { name: "Classes", path: "/school/classes" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 overflow-x-auto hide-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `py-3 text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SchoolNav;
