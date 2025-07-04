import Student from "../models/Student.js";

// Create Student
import Class from "../models/Class.js";

export const createStudent = async (req, res) => {
    try {
        const { name, dob, address, phone, bloodGroup, className, section, gender } = req.body;

        // 🔍 Step 1: Find Class by name + section + school
        const classData = await Class.findOne({
            className,
            section,
            school: req.user.userId
        });

        if (!classData) {
            return res.status(404).json({ message: "Class not found for given name & section" });
        }

        // 📸 Step 2: Handle photo
        const photo = req.file ? req.file.path : null;

        // 👨‍🎓 Step 3: Create Student
        const newStudent = await Student.create({
            name,
            dob,
            address,
            phone,
            gender, // ✅ add this line
            bloodGroup,
            photo,
            classId: classData._id,
            school: req.user.userId
        });

        res.status(201).json({
            message: "Student created successfully",
            student: newStudent
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating student",
            error: error.message
        });
    }
};

// Get All Students (School-specific)
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ school: req.user.userId }).populate("classId");
        res.status(200).json(students);
    } catch (error) {
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
