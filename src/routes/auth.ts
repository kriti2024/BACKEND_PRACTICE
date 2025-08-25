import { Router } from "express";
import { loginHandler } from "../controllers/auth.controller";

const authRouter = Router()

authRouter.post("/" ,loginHandler);


export default authRouter;
