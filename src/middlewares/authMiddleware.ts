import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

interface MyJwtPayload extends JwtPayload {
  id: number;
  email: string;
  userType: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload; // <-- now req.user exists
    }
  }
}


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const authHeader = req.headers["authorization"]
        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        const token = authHeader.split(" ")[1];
        let verifiedToken = await verifyToken(token)
        if(!verifiedToken){
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        
        req.user = verifiedToken as MyJwtPayload; // attach decoded user info
        next();
    } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Authentication failed", code: "ERR_001" });
    }
}