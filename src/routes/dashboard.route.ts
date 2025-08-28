import express from "express";
import { Request, Response } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { dashboard } from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/", authenticate, dashboard);

export default router;
