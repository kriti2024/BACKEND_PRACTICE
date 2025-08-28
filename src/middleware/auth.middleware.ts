import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

interface JwtPayload extends DefaultJwtPayload {
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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;

    return next();
  } catch (err: any) {
    console.error("Auth error:", err.message);
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

    return next();
  };
};
