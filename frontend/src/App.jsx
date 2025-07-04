import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import Schools from "./pages/Admin/Schools";


// Role-based Private Route
const PrivateRoute = ({ children, allowedRoles }) => {
  const { authData } = useAuth();

  if (!authData) return <Navigate to="/login" />;
  if (!allowedRoles.includes(authData.user.role)) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/school/dashboard"
            element={
              <PrivateRoute allowedRoles={["School"]}>
                <SchoolDashboard />
              </PrivateRoute>
            }
          />


          <Route path="*" element={<Navigate to="/login" />} />

          <Route path="/admin/schools" element={<PrivateRoute allowedRole={["Admin", "SuperAdmin"]}>
  <Schools />
</PrivateRoute>
} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
