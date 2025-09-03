import School from "../models/School.js";

// Add a new class
export const addClass = async (req, res) => {
  try {
    const schoolId = req.user.userId;
    const { className } = req.body;

    if (!className || !className.trim()) {
      return res.status(400).json({ message: "Class name is required" });
    }

    // Fetch school
    const school = await School.findById(schoolId);
    if (!school) return res.status(404).json({ message: "School not found" });

    // Prevent duplicates (case-insensitive)
    if (
      school.classes.some(
        (cls) => cls.toLowerCase() === className.toLowerCase()
      )
    ) {
      return res.status(400).json({ message: "Class already exists" });
    }

    // Push new class (atomic update)
    await School.updateOne(
      { _id: schoolId },
      { $push: { classes: className.trim() } }
    );

    res.status(201).json({ message: "Class added", className });
  } catch (err) {
    console.error("Error in addClass:", err);
    res.status(500).json({ message: err.message });
  }
};

// Remove a class
export const removeClass = async (req, res) => {
  try {
    const schoolId = req.user.userId;
    const { className } = req.params;

    if (!className || !className.trim()) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const result = await School.updateOne(
      { _id: schoolId },
      { $pull: { classes: className.trim() } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class removed", className });
  } catch (err) {
    console.error("Error in removeClass:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all classes for logged-in school
export const getClasses = async (req, res) => {
  try {
    const schoolId = req.user.userId;

    const school = await School.findById(schoolId).select("classes");
    if (!school) return res.status(404).json({ message: "School not found" });

    // Sort alphabetically (case-insensitive)
    const sortedClasses = school.classes.sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

    res.status(200).json({ classes: sortedClasses });
  } catch (err) {
    console.error("Error in getClasses:", err);
    res.status(500).json({ message: err.message });
  }
};
