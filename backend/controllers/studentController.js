import Student from "../models/Student.js";

// Create Student
export const createStudent = async (req, res) => {
    const { name, dob, photo, address, phone, bloodGroup, classId } = req.body;

    try {
        const newStudent = await Student.create({
            name,
            dob,
            photo,
            address,
            phone,
            bloodGroup,
            classId,
            school: req.user.userId // School's ID from token
        });
        res.status(201).json({ message: "Student created successfully", student: newStudent });
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
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
