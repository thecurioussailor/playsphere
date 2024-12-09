import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config"
const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
    
  if (!authHeader) {
    res.status(403).json({ error: "Authentication token required" });
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user  = {id: decoded.userId}; // Attach user ID to request object
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
