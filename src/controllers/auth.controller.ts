import client from "../config/db.config";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Both email and password are required",
      });
    }

    const user = await client.query(
      "SELECT * FROM userdetails WHERE email = $1",
      [email]
    );
    if (!user.rows.length) {
      return res.status(401).json({
        msg: "User with this email not found",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!checkPassword) {
      return res.status(401).json({
        msg: "Password not matched",
      });
    }

    const payload = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
      role: user.rows[0].role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      msg: "User logged in successfully",
      token,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      msg: "Server error while logging in",
      error: err,
    });
  }
};
