// Middleware to check if Admin has permission to manage schools
export const checkManageSchoolsPermission = (req, res, next) => {
    // Only check if user is an Admin
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Check permission from token payload
    if (!req.user.permissions?.manageSchools) {
        return res.status(403).json({ message: "Access denied. You don't have school management permission." });
    }

    next(); // Allow if permission is granted
};
