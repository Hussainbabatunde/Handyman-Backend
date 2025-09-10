"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        const token = authHeader.split(" ")[1];
        let verifiedToken = await (0, jwt_1.verifyToken)(token);
        if (!verifiedToken) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = verifiedToken; // attach decoded user info
        next();
    }
    catch (error) {
        console.error("Auth error:", error);
        res.status(500).json({ message: "Authentication failed", code: "ERR_001" });
    }
};
exports.authMiddleware = authMiddleware;
