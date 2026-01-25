import {Router} from "express";
import {userLoginController, userSignUpController, verifyUserController} from "../controllers/user.auth.controller";
export const userRouter = Router();

userRouter.post("/register", userSignUpController);
userRouter.post("/login", userLoginController);
userRouter.post("/verify", verifyUserController);