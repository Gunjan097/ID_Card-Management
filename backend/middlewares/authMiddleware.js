import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token, access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const superAdminOnly = (req, res, next) => {
    if (req.user.role !== "SuperAdmin") {
        return res.status(403).json({ message: "Super Admin access only" });
    }
    next();
};

export const adminOnly = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};
