import { NextFunction, type Request, type Response } from "express";
import { UserService } from "./user.service";
import { GetAllResponse } from "../../../common/types/apiResponse";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import {
  CreateUserDTO,
  UserLoginDTO,
  UserQueryDto,
  UserResponse,
} from "../types/user.types";
import { handleError, hashingPassword } from "../../../common/utils/helpers";

const getAllUsers = async <T extends UserQueryDto>(
  req: Request<any, any, any, T>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rows, count } = await UserService.getAllUsers(req.query);

    const response: GetAllResponse<UserResponse> = {
      status: "success",
      data: rows,
      results: rows.length,
      total: count,
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role, email, fullName, firstName, lastName } =
      req.body;
    const hashedPassword = await hashingPassword(password);
    const newUser: CreateUserDTO = {
      username,
      password: hashedPassword,
      email: email || undefined,
      role: role || "user",
      firstName,
      lastName,
    };
    const user = await UserService.createUser(newUser);
    res.status(201).json(user);
  } catch (error) {
    handleError(error, res);
  }
};
const getOnUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (req.body.password) {
      req.body.password = await hashingPassword(req.body.password);
    }
    const user = await UserService.updateUser(data, id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteManyUsers = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids;
    const user = await UserService.deleteManyUsers(ids);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (
  req: Request<any, any, UserLoginDTO, any>,
  res: Response,
) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    const user = await UserService.findByUsername(username);

    // generic error — don't reveal whether user exists or password was wrong
    const isValid = user && (await bcrypt.compare(password, user.password));
    if (!isValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" },
    );

    // const refreshToken = jwt.sign(
    //   { id: user.id },
    //   process.env.JWT_REFRESH_SECRET!,
    //   { expiresIn: "7d" },
    // );

    // await UserService.saveRefreshToken(user.id, refreshToken);

    // send refresh token as httpOnly cookie — never exposed to JS
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    // });

    res.status(200).json({
      accessToken,
      // refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const refreshToken = async (req: Request, res: Response) => {
//   try {
//     const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//       res.status(401).json({ message: "No refresh token provided" });
//       return;
//     }

//     const payload = jwt.verify(
//       refreshToken,
//       process.env.JWT_REFRESH_SECRET!,
//     ) as { id: string };
//     const user = await UserService.getUserById(payload.id);
//     if (!user || user.refreshToken !== refreshToken) {
//       res.status(401).json({ message: "Invalid refresh token" });
//       return;
//     }

//     const newAccessToken = jwt.sign(
//       { id: user.id, role: user.role },
//       process.env.JWT_ACCESS_SECRET!,
//       { expiresIn: "15m" },
//     );
//     const newRefreshToken = jwt.sign(
//       { id: user.id },
//       process.env.JWT_REFRESH_SECRET!,
//       { expiresIn: "7d" },
//     );
//     await UserService.saveRefreshToken(user.id, newRefreshToken);
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
//     });

//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// const logout = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.refreshToken;
//     const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
//       id: string;
//     };
//     if (token) {
//       await UserService.saveRefreshToken(payload.id, null);
//     }
//     res.clearCookie("refreshToken");
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export {
  login,
  getAllUsers,
  createUser,
  getOnUser,
  updateUser,
  deleteManyUsers,
};
