import { Router } from "express";
import userRouter from "../modules/users/user.routes";
import accountRouter from "../modules/accounts/account.routes";
const router = Router();

router.use("/users", userRouter);
router.use("/accounts", accountRouter);
export default router;
