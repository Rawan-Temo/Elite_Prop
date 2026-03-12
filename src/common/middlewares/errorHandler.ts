import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../types/errors";
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        code: "CONFLICT",
        message: "Resource already exists",
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Resource not found",
      });
      return;
    }
  }

  // Operational errors (AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: err.message,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.path} not found`,
  });
}
