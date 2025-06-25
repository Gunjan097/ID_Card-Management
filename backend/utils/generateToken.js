import jwt from "jsonwebtoken";

const generateToken = (userId, role, permissions = {}) => {
    return jwt.sign(
        { userId, role, permissions }, // include permissions in token
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export default generateToken;
