import Class from "../models/Class.js";

// Create Class
export const createClass = async (req, res) => {
    const { className, section } = req.body;

    try {
        const newClass = await Class.create({
            className,
            section,
            school: req.user.userId // School's ID from token
        });
        res.status(201).json({ message: "Class created successfully", classData: newClass });
    } catch (error) {
        res.status(500).json({ message: "Error creating class", error: error.message });
    }
};

// Get All Classes (School-specific)
export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({ school: req.user.userId });
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching classes", error: error.message });
    }
};

// Delete Class
export const deleteClass = async (req, res) => {
    try {
        const classData = await Class.findOne({ _id: req.params.id, school: req.user.userId });
        if (!classData) return res.status(404).json({ message: "Class not found" });

        await classData.deleteOne();
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting class", error: error.message });
    }
};
