import { Router } from "express";
import { createUser, getAllUsers, updateUser, deleteUser } from "../controllers/user.controller.js";

const userRouter = Router()
userRouter.get("/" ,getAllUsers);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
