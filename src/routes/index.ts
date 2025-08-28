import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import productRouter from "./product.route";
import dashboardRouter from "./dashboard.route";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/product", productRouter);
router.use("/dashboard", dashboardRouter);

export default router;
