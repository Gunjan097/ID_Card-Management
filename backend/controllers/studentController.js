import Student from "../models/studentModel.js";
import Class from "../models/classModel.js";

// ✅ Create a new student
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      gender,
      className, // must exist for this school
      adharNumber,
      fatherName,
      motherName,
      rollNo,
      uniqueId,
      grNo,
      rfidNo,
    } = req.body;

    const schoolId = req.user.id; // logged-in school from auth

    if (!name || !gender || !className) {
      return res.status(400).json({ message: "Name, gender and class are required" });
    }

    // Check if class exists for this school
    const validClass = await Class.findOne({ className, school: schoolId });
    if (!validClass) {
      return res.status(400).json({ message: "Invalid class for this school" });
    }

    const newStudent = await Student.create({
      name,
      gender,
      className: validClass.className,
      school: schoolId,
      adharNumber,
      fatherName,
      motherName,
      rollNo,
      uniqueId,
      grNo,
      rfidNo,
    });

    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: "Error creating student", error: err.message });
  }
};

// ✅ Get all students for a school (with search + pagination)
export const getAllStudents = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      school: schoolId,
      name: { $regex: search, $options: "i" }, // case-insensitive search
    };

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    res.json({
      students,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
};

// ✅ Get students by class (with pagination)
export const getStudentsByClass = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const { className } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = { school: schoolId, className: new RegExp(`^${className}$`, "i") };

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Student.countDocuments(query);

    res.json({
      students,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching students by class", error: err.message });
  }
};

// ✅ Get single student by ID
export const getStudentById = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const student = await Student.findOne({ _id: req.params.id, school: schoolId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student", error: err.message });
  }
};

// ✅ Update student
export const updateStudent = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    // If className is being updated, validate it
    if (updates.className) {
      const validClass = await Class.findOne({ className: updates.className, school: schoolId });
      if (!validClass) {
        return res.status(400).json({ message: "Invalid class for this school" });
      }
      updates.className = validClass.className;
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: id, school: schoolId },
      updates,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err.message });
  }
};

// ✅ Delete student
export const deleteStudent = async (req, res) => {
  try {
    const schoolId = req.user.id;
    const { id } = req.params;

    const student = await Student.findOneAndDelete({ _id: id, school: schoolId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student", error: err.message });
  }
};
