import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../../modules/users/handlers/user.service";
import { User } from "../../generated/prisma/client";
import { handleError } from "../utils/helpers";



export const authenticateToken = async (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as { id: string; role: string };

    const foundUser = await UserService.getUserById(decoded.id);
    if (!foundUser) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }


    req.user = foundUser ;
    next();
  } catch (error) {
    handleError(error, res);
  }
};

export const allowedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const currentUser = res.locals.currentUser;

    if (!currentUser) {
      res.status(401).json({ status: "fail", message: "Unauthorized" });
      return;
    }

    if (!roles.includes(currentUser.role)) {
      res.status(403).json({ status: "fail", message: "Forbidden" });
      return;
    }

    next();
  };
};