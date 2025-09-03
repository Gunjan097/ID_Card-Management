import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SchoolDashboard from "./pages/School/SchoolDashboard";
import Students from "./pages/School/Students";
import AddStudent from "./pages/School/AddStudent";
import EditStudent from "./pages/School/EditStudent";
import Staff from "./pages/School/Staff";
import Orders from "./pages/School/Orders";
import Systems from "./pages/School/Systems";
import Notifications from "./pages/School/Notifications";
import Reports from "./pages/School/Reports";
import Settings from "./pages/School/Settings";
import Users from "./pages/School/Users";
import ClassManagement from "./pages/School/ClassManagement";
import ClassStudents from "./pages/School/ClassStudents";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* School Section */}
        <Route path="/school/class/:className" element={<ClassStudents />} />
        <Route path="/school/dashboard" element={<SchoolDashboard />} />
        <Route path="/school/students" element={<Students />} />
        <Route path="/school/add-student/" element={<AddStudent />} />
        <Route path="/school/edit-student/:id" element={<EditStudent />} />
        <Route path="/school/staff" element={<Staff />} />
        <Route path="/school/orders" element={<Orders />} />
        <Route path="/school/systems" element={<Systems />} />
        <Route path="/school/notifications" element={<Notifications />} />
        <Route path="/school/classes" element={<ClassManagement />} />
        <Route path="/school/reports" element={<Reports />} />
        <Route path="/school/settings" element={<Settings />} />
        <Route path="/school/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
