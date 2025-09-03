import Student from "../models/Student.js";
import fs from "fs";
import csv from "csv-parser";
import XLSX from "xlsx";

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (School only)
export const createStudent = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      uniqueId,
      grNo,
      rfidNo,
      dob,
      phone1,
      phone2,
      aadharNumber,
      fatherName,
      motherName,
      gender,
      className,
    } = req.body;

    if (!name || !className) {
      return res.status(400).json({ message: "Name and className are required" });
    }
    console.log(req.user)

    const student = new Student({
      school: req.user.userId, // from authMiddleware
      name,
      rollNo,
      uniqueId,
      grNo,
      rfidNo,
      aadharNumber,
      fatherName,
      motherName,
      dob,
      phone1,
      phone2,
      gender,
      className,
      photo: req.file ? req.file.path : null,
    });

    // console.log(student)
    const createdStudent = await student.save();
    res.status(201).json(createdStudent);
  } catch (error) {
    if (error.code === 11000) { // duplicate key error
      res.status(400).json({ error: "Duplicate entry" });
    } else {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
};

// @desc    Get all students of a school (paginated)
// @route   GET /api/students
// @access  Private (School only)
export const getAllStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, className } = req.query;

    // Build query
    const query = { school: req.user.userId };
    if (className) query.className = className;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { rollNo: { $regex: search, $options: "i" } },
        { uniqueId: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      students,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// @desc    Get students by className (paginated, case-insensitive)
// @route   GET /api/students/class/:className
// @access  Private (School only)
export const getStudentsByClassName = async (req, res) => {
  try {
    const { className } = req.params;

    const query = {
      school: req.user.userId,
      className: { $regex: new RegExp(`^${className}$`, "i") }, // case-insensitive match
    };

    const students = await Student.find(query).sort({ createdAt: -1 });

    res.json({
      students,
      total: students.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private (School only)
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      school: req.user.userId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (School only)
export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      uniqueId,
      grNo,
      rfidNo,
      aadharNumber,
      fatherName,
      motherName,
      dob,
      phone1,
      phone2,
      gender,
      className,
    } = req.body;

    const student = await Student.findOne({
      _id: req.params.id,
      school: req.user.userId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // update fields
    if (name) student.name = name;
    if (rollNo) student.rollNo = rollNo;
    if (uniqueId) student.uniqueId = uniqueId;
    if (grNo) student.grNo = grNo;
    if (rfidNo) student.rfidNo = rfidNo;
    if (aadharNumber) student.aadharNumber = aadharNumber;
    if (fatherName) student.fatherName = fatherName;
    if (motherName) student.motherName = motherName;
    if (dob) student.dob = dob;
    if (phone1) student.phone1 = phone1;
    if (phone2) student.phone2 = phone2;
    if (gender) student.gender = gender;
    if (className) student.className = className;

    if (req.file) {
      student.photo = req.file.path; // update photo if new file uploaded
    }

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (School only)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      school: req.user.userId,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const importStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const results = [];

    if (req.file.mimetype === "text/csv") {
      // ✅ Parse CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          results.push(row);
        })
        .on("end", async () => {
          await saveStudents(results, req.user.userId);
          fs.unlinkSync(filePath); // remove file after import
          res.json({ message: "CSV imported successfully" });
        });
    } else {
      // ✅ Parse Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await saveStudents(sheetData, req.user.userId);
      fs.unlinkSync(filePath);
      res.json({ message: "Excel imported successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Helper to save to DB
const saveStudents = async (data, schoolId) => {
  for (let row of data) {
    // Example expected headers in CSV/Excel: name, rollNo, className, gender, dob
    const student = new Student({
      school: schoolId,
      name: row.name,
      rollNo: row.rollNo,
      className: row.className,
      gender: row.gender,
      dob: row.dob ? new Date(row.dob) : null,
      phone1: row.phone1,
      fatherName: row.fatherName,
      motherName: row.motherName,
    });

    // prevent duplicates if needed
    await Student.findOneAndUpdate(
      { uniqueId: row.uniqueId, school: schoolId },
      student,
      { upsert: true }
    );
  }
};