import { Request, Response } from "express";
import userRoute from "./user.routing";

export const getUser = async (req: Request, res: Response) => {
  const { name, email } = res.locals.jwtPayload;
  return res
    .status(200)
    .json({ status: 200, data: { email: email, name: name } });
};
