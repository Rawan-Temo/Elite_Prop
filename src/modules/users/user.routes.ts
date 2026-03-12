import express from "express";
import {
  getAllUsers,
  createUser,
  getOnUser,
  updateUser,
  deleteManyUsers,
  login,
} from "./handlers/user.controller";
import { validate, validateQuery } from "../../common/middlewares/validate";
import { createUserSchema, updateUserSchema } from "./types/user.validation";
import { UserQueryDto } from "./types/user.types";
import { authenticateToken } from "../../common/middlewares/authMiddleware";
const userFields = [
  "username",
  "id",
  "email",
  "fullName",
  "role",
  "active",
  "createdAt",
  "updatedAt",
];
const router = express.Router();
// Define user-related routes here
router
  .route("/")
  .get(authenticateToken, validateQuery<UserQueryDto>(userFields), getAllUsers)
  .post(validate(createUserSchema), createUser);

router.route("/login").post(login);
// router.route("/refreshToken").post(refreshToken);

router.route("/delete-many").delete(deleteManyUsers);

// T extends the post function itself u can set the request body
router
  .route("/:id")
  .get(getOnUser)
  .patch(validate(updateUserSchema), updateUser);

export default router;
