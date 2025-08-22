import client from "../config/db.config";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const checkPassword = bcrypt.compare(password, user.rows[0].password);
    if (!checkPassword)
      return res.status(401).json({
        msg: "Password not matched",
      });
    return res.status(200).json({
      msg: "User logged in",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error while logging",
      error: err,
    });
  }



  
};
