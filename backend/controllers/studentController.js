import csv from "csv-parser";
import fs from "fs";
import Student from "../models/Student.js";
import { Parser } from "json2csv"; // For CSV export
// import Class from "../models/Class.js";

// Create Student
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      address,
      phone,
      bloodGroup,
      className,
      section,
      gender,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !dob || !address || !phone || !className || !section || !gender) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // 📸 Get Photo from multer upload (Cloudinary)
    const photo = req.file?.path;
    if (!photo) {
      return res.status(400).json({ message: "Photo is required" });
    }

    // 👨‍🎓 Create Student
    const newStudent = await Student.create({
      name,
      dob,
      gender,
      className,
      section,
      address,
      phone,
      bloodGroup,
      photo,
      school: req.user.userId, // linked to current school
    });

    res.status(201).json({
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Error creating student", error);
    res.status(500).json({
      message: "Error creating student",
      error: error.message,
    });
  }
};

// Get Students by className
export const getStudentsByClassName = async (req, res) => {
  const { className } = req.params;

  try {
    const students = await Student.find({
      school: req.user.userId,
      className: { $regex: new RegExp(`^${className}$`, "i") }  // Case-insensitive match
    });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by class", error);
    res.status(500).json({ message: "Error fetching students by class", error: error.message });
  }
};


// Get All Students (School-specific)
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ school: req.user.userId });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students", error);
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};


// Delete Student
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findOne({ _id: req.params.id, school: req.user.userId });
        if (!student) return res.status(404).json({ message: "Student not found" });

        await student.deleteOne();
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student", error: error.message });
    }
};


// export const updateStudent = async (req, res) => {
//   try {
//     const { name, dob, address, phone, bloodGroup, className, gender } = req.body;
//     const studentId = req.params.id;

//     const student = await Student.findOne({ _id: studentId, school: req.user.userId });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     // Handle new photo upload if provided
//     const photo = req.file ? req.file.path : student.photo;

//     // Update fields
//     student.name = name || student.name;
//     student.dob = dob || student.dob;
//     student.gender = gender || student.gender;
//     student.className = className || student.className;
//     student.address = address || student.address;
//     student.phone = phone || student.phone;
//     student.bloodGroup = bloodGroup || student.bloodGroup;
//     student.photo = photo;

//     await student.save();

//     res.status(200).json({ message: "Student updated successfully", student });
//   } catch (error) {
//     console.error("Error updating student", error);
//     res.status(500).json({ message: "Error updating student", error: error.message });
//   }
// };


// ===============================
// @desc    Export Students to CSV
// @route   GET /api/students/export/:className
// @access  School
// ===============================
export const exportStudentsToCSV = async (req, res) => {
  try {
    const { className } = req.params;
    const students = await Student.find({
      school: req.user.userId,
      className: { $regex: new RegExp(`^${className}$`, "i") }
    });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found in this class" });
    }

    const csvFilePath = path.join("exports", `${className}_students.csv`);
    const ws = fs.createWriteStream(csvFilePath);

    csv.write(
      students.map((s) => ({
        name: s.name,
        dob: s.dob,
        gender: s.gender,
        phone: s.phone,
        address: s.address,
        bloodGroup: s.bloodGroup,
        className: s.className,
        photo: s.photo,
      })),
      { headers: true }
    ).pipe(ws);

    ws.on("finish", () => {
      res.download(csvFilePath, (err) => {
        if (err) console.error("Download error:", err);
        fs.unlinkSync(csvFilePath); // cleanup
      });
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ message: "CSV export failed", error: error.message });
  }
};


// ===============================
// @desc    Import Students from CSV
// @route   POST /api/students/import/:className
// @access  School
// ===============================
export const importStudentsFromCSV = async (req, res) => {
  try {
    const { className } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const students = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => {
        students.push({ ...row, school: req.user.userId, className });
      })
      .on("end", async () => {
        await Student.insertMany(students);
        fs.unlinkSync(req.file.path); // cleanup uploaded file
        res.status(201).json({ message: "Students imported successfully", count: students.length });
      });
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({ message: "Import failed", error: error.message });
  }
};


export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, school: req.user.userId });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student", error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.photo = req.file.path;

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, school: req.user.userId },
      updates,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student updated successfully", student });
  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err.message });
  }
};

