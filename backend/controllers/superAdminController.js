// controllers/superAdminController.js
import Admin from "../models/Admin.js";
import School from "../models/School.js";

// ===============================
// @desc   Get All Admins
// @route  GET /api/superadmin/admins
// @access Super Admin Only
// ===============================
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("createdBy", "email");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins", error: error.message });
  }
};

// ===============================
// @desc   Delete Admin by ID
// @route  DELETE /api/superadmin/admin/:id
// @access Super Admin Only
// ===============================
export const deleteAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admin", error: error.message });
  }
};

// ===============================
// @desc   Get All Schools
// @route  GET /api/superadmin/schools
// @access Super Admin Only
// ===============================
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().populate("createdBy", "email");
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schools", error: error.message });
  }
};

// ===============================
// @desc   Delete School by ID
// @route  DELETE /api/superadmin/school/:id
// @access Super Admin Only
// ===============================
export const deleteSchool = async (req, res) => {
  try {
    await School.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "School deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete school", error: error.message });
  }
};


// Super Admin changes Admin or School password
export const superAdminChangePassword = async (req, res) => {
  const { userId, newPassword, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (role === "Admin") {
      await Admin.findByIdAndUpdate(userId, { password: hashedPassword });
    } else if (role === "School") {
      await School.findByIdAndUpdate(userId, { password: hashedPassword });
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};
