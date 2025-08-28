import { Request, Response } from "express";
export const dashboard = async (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    msg: "Welcome to the dashbaord",
    user,
  });
};
