import {  BrowserRouter as Router,  Routes,  Route,  Navigate,} from "react-router-dom";

// Import AuthProvider to wrap the app and useAuth to access auth state
import { AuthProvider, useAuth } from "./context/AuthContext";
// Import pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/School/SchoolDashboard";
import Schools from "./pages/Admin/Schools";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AddSchool from "./pages/AddSchool";
import ViewSchools from "./pages/ViewSchools";
import AddClass from "./pages/School/AddClass";
import ViewClasses from "./pages/School/ViewClasses";  
import AddStudent from "./pages/School/AddStudent";
import ViewStudents from "./pages/School/ViewStudents";
import ClassView from "./pages/School/ClassView";

// 🛡️ Role-based Route Protection
const PrivateRoute = ({ children, allowedRoles }) => {
  const { authData } = useAuth(); // Get auth state from context

  // If no user is logged in, redirect to login page
  if (!authData) return <Navigate to="/login" />;

  // Safeguard: If allowedRoles is not passed correctly, redirect
  if (!Array.isArray(allowedRoles)) return <Navigate to="/login" />;

  // If the user's role is not allowed, redirect to login
  if (!allowedRoles.includes(authData.user.role)) return <Navigate to="/login" />;

  // Otherwise, render the child route
  return children;
};

// 🌐 Main App Component
function App() {
  return (
    // AuthProvider wraps the entire app and provides login/logout/token functionality
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Dashboard Route */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected School Dashboard Route */}
          <Route
            path="/school/dashboard"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <SchoolDashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Schools Management Page for Admin and SuperAdmin */}
          <Route
            path="/admin/schools"
            element={
              <PrivateRoute allowedRoles={["Admin", "SuperAdmin"]}>
                <Schools />
              </PrivateRoute>
            }
          />

          <Route path="/superadmin-dashboard" element={<PrivateRoute allowedRoles={["SuperAdmin"]}><SuperAdminDashboard /></PrivateRoute>} />

          <Route
            path="/admin/add-school"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AddSchool />
              </PrivateRoute>
            }
          />


          <Route path="/admin/view-schools" element={<PrivateRoute allowedRoles={["Admin"]}><ViewSchools /></PrivateRoute>} />

        // For School-only access
          <Route
            path="/school/dashboard"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <SchoolDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/school/add-class"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <AddClass />
              </PrivateRoute>
            }
          />

          <Route
            path="/school/view-classes"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <ViewClasses />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/school/add-student"
            element={<PrivateRoute allowedRoles={["School"]}><AddStudent /></PrivateRoute>}
          />

          <Route
            path="/school/add-student"
            element={<PrivateRoute allowedRoles={["School"]}><AddStudent /></PrivateRoute>}
          />
          <Route
            path="/school/view-students"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <ViewStudents />
              </PrivateRoute>
            }
          />

          
          <Route
            path="/school/class/:className"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <ClassView />
              </PrivateRoute>
            }
          />



          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
