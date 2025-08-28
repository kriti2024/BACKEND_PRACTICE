import { Request, Response } from "express";
import client from "../config/db.config";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const user = (req as any).user;

    const { rows } = await client.query(
      `INSERT INTO products (name, description, price, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, user.id]
    );

    return res.status(201).json({
      msg: "Product created successfully",
      product: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      msg: "server error",
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    let query =
      "SELECT products.id, products.name, products.description, products.price, userdetails.username, userdetails.email, userdetails.role FROM products JOIN userdetails ON products.user_id = userdetails.id";
    let params = [];

    if (user.role === "product owner") {
      query += " WHERE user_id = $1 ";
      params = [user.id];
    }

    const { rows } = await client.query(query, params);
    return res.status(200).json({
      products: rows,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const user = (req as any).user;

    const { rows: existingRows } = await client.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    const product = existingRows[0];

    if (user.role !== "admin" && product.user_id !== user.id) {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    const { rows } = await client.query(
      "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [name, description, price, id]
    );

    return res.status(200).json({
      msg: "Product updated",
      product: rows[0],
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const { rows: existingRows } = await client.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    const product = existingRows[0];

    if (user.role !== "admin" && product.user_id !== user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await client.query("DELETE FROM products WHERE id = $1", [id]);
    return res.status(200).json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
