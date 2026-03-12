import express from "express";
import {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteManyUsers,
  login,
  refreshToken,
  logout,
} from "./handlers/user.controller";
import { validate, validateQuery } from "../../common/middlewares/validate";
import { createUserSchema, updateUserSchema } from "./types/user.validation";
import { UserQueryDto } from "./types/user.types";
import {
  allowedTo,
  authenticateToken,
} from "../../common/middlewares/authMiddleware";
import { userFields } from "./types/constants";

const router = express.Router();
// Define user-related routes here
router
  .route("/")
  .get(
    authenticateToken,
    allowedTo("admin"),
    validateQuery<UserQueryDto>(userFields),
    getAllUsers,
  )
  .post(
    authenticateToken,
    allowedTo("admin"),
    validate(createUserSchema),
    createUser,
  );

router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/refreshToken").post(refreshToken);

router
  .route("/delete-many")
  .delete(authenticateToken, allowedTo("admin"), deleteManyUsers);

// T extends the post function itself u can set the request body
router
  .route("/:id")
  .get(authenticateToken, allowedTo("admin"), getOneUser)
  .patch(
    authenticateToken,
    allowedTo("admin"),
    validate(updateUserSchema),
    updateUser,
  );

export default router;
