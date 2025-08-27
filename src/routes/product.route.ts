import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(["admin", "product owner"]),
  createProduct
);

router.get("/", authenticate, getProducts);

router.put(
  "/:id",
  authenticate,
  authorize(["admin", "product owner"]),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "product owner"]),
  deleteProduct
);

export default router;
