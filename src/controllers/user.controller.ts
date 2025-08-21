import client from "../config/db.config";
import { Request, Response } from "express";

interface User {
  id: number;
  username: string;
  address: string;
  contact: string;
  email: string;
  dob: string;
  password: string;
  role: "admin" | "customer";
  gender: "male" | "female";
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, perPage = 10, search = "" } = req.query;
    let dbQuery = "SELECT * FROM userdetails";
    const values = [];

    if (search) {
      dbQuery += " WHERE username ILIKE $1 OR email ILIKE $1";
      values.push(`%${search}%`);
    }

    const offset = page ? (Number(page) - 1) * Number(perPage) : 0;
    dbQuery += ` LIMIT ${perPage} OFFSET ${offset}`;

    const { rows, rowCount } = await client.query(dbQuery, values);

    return res.status(200).json({
      msg: "User fetched successfully",
      user: rows,
      totalCount: rowCount,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error is fetching users",
      error: err,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, address, contact, email, dob, password, role, gender } =
      req.body;

    const emailExist = await client.query(
      "SELECT * FROM userdetails WHERE email=$1",
      [email]
    );
    if (emailExist?.rows?.length > 0) {
      return res.status(400).json({
        msg: "Email already exists",
      });
    }

    const { rows } = await client.query(
      "INSERT INTO userdetails (username, address, contact, email, dob, password, role, gender ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)  RETURNING *",
      [username, address, contact, email, dob, password, role, gender]
    );

    return res.status(201).json({
      msg: " user added successfully",
      user: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in adding user",
      error: err,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, address, contact, email, dob, password, role, gender } =
      req.body;

    const userExist = await client.query(
      "SELECT * FROM  userdetails WHERE id=$1",
      [id]
    );
    if (userExist?.rows?.length < 1) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    const emailExist = await client.query(
      "SELECT * FROM userdetails WHERE email=$1 AND id<>$2",
      [email, id]
    );
    if (emailExist.rows.length > 0) {
      return res.status(400).json({
        msg: "Email already exists",
      });
    }

    const { rows } = await client.query(
      "UPDATE userdetails SET username=$1, address=$2, contact=$3, email=$4, dob=$5, password=$6, role=$7, gender=$8  WHERE id=$9 RETURNING *",
      [username, address, contact, email, dob, password, role, gender, id]
    );

    return res.status(200).json({
      msg: "User updated successfully",
      user: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      msg: "User not updated",
      error: err,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userExist = await client.query<User>(
      "SELECT * FROM userdetails WHERE id=$1",
      [id]
    );

    if (userExist?.rows?.length < 1) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    const { rows } = await client.query<User>(
      "DELETE FROM userdetails WHERE id=$1 RETURNING *",
      [id]
    );

    return res.status(200).json({
      msg: "User deleted successfully",
      user: rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Cannot delete user",
      error: err,
    });
  }
};
