import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    // Get token from the Authorization header (format: "Bearer token_here")
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    try {
        // Verify token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to the request object for use in controllers/routes
        req.user = decoded;

        // Call next() to move to the next middleware or controller
        next();
    } catch (error) {
        // Token is invalid or expired
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
