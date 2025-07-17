import bcrypt from "bcryptjs";
import School from "../models/School.js";

// ===============================
// @desc    Admin creates School
// @route   POST /api/schools
// @access  Admin (permission required)
// ===============================
export const createSchool = async (req, res) => {
    const { schoolName, address, phoneNumber, email, password } = req.body;

    try {
        const existingSchool = await School.findOne({ email });
        if (existingSchool) return res.status(400).json({ message: "School already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newSchool = await School.create({
            schoolName,
            address,
            phoneNumber,
            email,
            password: hashedPassword,
            createdBy: req.user.userId // Admin ID
        });

        res.status(201).json({ message: "School created successfully", school: newSchool });
    } catch (error) {
        res.status(500).json({ message: "Error creating school", error: error.message });
    }
};

// ===============================
// @desc    Get All Schools (Admin)
// @route   GET /api/schools
// @access  Admin (permission required)
// ===============================
// controllers/schoolController.js
export const getAllSchools = async (req, res) => {
  try {
    // Allow if role is SuperAdmin OR if Admin has manageSchools permission
    if (
      req.user.role !== "SuperAdmin" &&
      !(req.user.role === "Admin" && req.user.permissions?.manageSchools)
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    const schools = await School.find();
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: "Error fetching schools", error: error.message });
  }
};


// ===============================
// @desc    Delete School by ID
// @route   DELETE /api/schools/:id
// @access  Admin (permission required)
// ===============================
export const deleteSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ message: "School not found" });

        await school.deleteOne();
        res.status(200).json({ message: "School deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting school", error: error.message });
    }
};

// ===============================
// @desc    Admin changes password of their School
// @route   PUT /api/schools/:id/change-password
// @access  Admin (only for schools created by them)
// ===============================
export const changeSchoolPassword = async (req, res) => {
  const { newPassword } = req.body;
  const schoolId = req.params.id;

  try {
    const school = await School.findOne({ _id: schoolId, createdBy: req.user.userId });
    if (!school) return res.status(403).json({ message: "You don't have permission to update this school" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await School.findByIdAndUpdate(schoolId, { password: hashedPassword });

    res.status(200).json({ message: "School password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};


