import { authenticateToken } from "../../common/middlewares/authMiddleware";
import { validate, validateQuery } from "../../common/middlewares/validate";
import express from "express";
import {
  createAccountSchema,
  updateAccountSchema,
} from "./types/account.validation";
import {
  createAccount,
  deleteManyAccounts,
  getAllAccounts,
  getOneAccount,
  updateAccount,
} from "./handlers/account.controller";
import { accountFields } from "./types/constants";
import { AccountQueryDto } from "./types/account.types";
const router = express.Router();
// Define user-related routes here
router
  .route("/")
  .get(
    authenticateToken,
    validateQuery<AccountQueryDto>(accountFields),
    getAllAccounts,
  )
  .post(validate(createAccountSchema), createAccount);

router.route("/delete-many").delete(deleteManyAccounts);

router
  .route("/:id")
  .get(getOneAccount)
  .patch(validate(updateAccountSchema), updateAccount);

export default router;
