import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// configuration
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
