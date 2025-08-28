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
    const { page = 1, perPage = 10 } = req.query;

    let dbQuery =
      "SELECT products.id, products.name, products.description, products.price, userdetails.username, userdetails.email, userdetails.role FROM products JOIN userdetails ON products.user_id = userdetails.id";

    const values = [];
    let counter = 1;

    if (user.role === "product owner") {
      dbQuery += `WHERE user_id = $${counter}`;
      values.push(user.id);
      counter++;
    }

    if (perPage) {
      dbQuery += ` LIMIT $${counter}`;
      counter++;
      values.push(Number(perPage));
    }

    if (page) {
      const offset = page ? (Number(page) - 1) * Number(perPage) : 0;
      dbQuery += ` OFFSET $${counter}`;
      values.push(offset);
      counter++;
    }

    const { rows, rowCount } = await client.query(dbQuery, values);
    return res.status(200).json({
      msg: "All product fetched",
      products: rows,
      totalCount: rowCount,
      currentPage: Number(page),
      perPage: Number(perPage),
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
