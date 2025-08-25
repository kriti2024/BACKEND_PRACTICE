import { Router } from "express";
import { createUser, getAllUsers, updateUser, deleteUser } from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/" ,getAllUsers);
userRouter.post("/", authorize(["admin"]), createUser);
userRouter.put("/:id", authorize(["admin"]), updateUser);
userRouter.delete("/:id", authorize(["admin"]), deleteUser);

export default userRouter;
