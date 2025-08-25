import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  role: string;
  email: string;
  username?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
