import bcrypt from "bcryptjs";
import SuperAdmin from "../models/SuperAdmin.js";
import Admin from "../models/Admin.js";
import School from "../models/School.js";
import generateToken from "../utils/generateToken.js";

// ===============================
// Super Admin Signup (Only Once)
// ===============================
export const superAdminSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingSuperAdmin = await SuperAdmin.findOne({});
        if (existingSuperAdmin) {
            return res.status(400).json({ message: "Super Admin already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const superAdmin = await SuperAdmin.create({ username, email, password: hashedPassword });
        const token = generateToken(superAdmin._id, "SuperAdmin");

        res.status(201).json({ token, user: { id: superAdmin._id, username, email, role: "SuperAdmin" } });
    } catch (error) {
        res.status(500).json({ message: "Error creating Super Admin", error: error.message });
    }
};

// ===============================
// Super Admin Login
// ===============================
export const superAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) return res.status(404).json({ message: "Super Admin not found" });

        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = generateToken(superAdmin._id, "SuperAdmin");
        res.json({ token, user: { id: superAdmin._id, email, role: "SuperAdmin" } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// ===============================
// Super Admin Creates Admin
// ===============================
export const createAdmin = async (req, res) => {
    const { username, email, password, permissions } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            permissions,
            createdBy: req.user.userId
        });

        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Error creating admin", error: error.message });
    }
};

// ===============================
// Admin Login (Forgot to add in last response)
// ===============================
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = generateToken(admin._id, "Admin");

        res.json({ token, user: { id: admin._id, email, role: "Admin", permissions: admin.permissions } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// ===============================
// School Login
// ===============================
export const schoolLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const school = await School.findOne({ email });
        if (!school) return res.status(404).json({ message: "School not found" });

        const isMatch = await bcrypt.compare(password, school.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = generateToken(school._id, "School");

        res.json({ token, user: { id: school._id, email, role: "School" } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};
