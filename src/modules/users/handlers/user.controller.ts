import { type Request, type Response } from "express";
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
import { prisma } from "@/prisma/client";

const getAllUsers = async <T extends UserQueryDto>(
  req: Request<any, any, any, T>,
  res: Response,
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    // fix 5: removed unused fullName destructure
    const { username, password, role, email, firstName, lastName } = req.body;
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

const getOneUser = async (req: Request, res: Response) => {
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

    // fix 4: hash first, then build the update object cleanly
    const data = { ...req.body };
    if (data.password) {
      data.password = await hashingPassword(data.password);
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
    const { username, password } = req.body;

    const user = await UserService.findByUsername(username);

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

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    await UserService.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // fix 1: removed refreshToken from response body
    res.status(200).json({
      accessToken,
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

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
    };

    const user = await UserService.getUserById(payload.id);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" },
    );
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    // fix 3: invalidate old token before saving new one
    await UserService.saveRefreshToken(user.id, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
          id: string;
        };
        await UserService.saveRefreshToken(payload.id, null);
      } catch {
        // token invalid or expired — still proceed with logout
      }
    }
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// =========================================================================

export {
  login,
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteManyUsers,
  refreshToken,
  logout,
};
