import {NextFunction,Request, Response} from "express";
import {ErrorMessages, HttpCodes, InfoMessages} from "../constants/messages";
import {createUserService, signInUserService, verifyUserService} from "../services/user.service";
import {AppError} from "../util/app.error";

export const userSignUpController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.USER_SIGNUP_STARTED);
        const data = await createUserService(req.body);
        console.log(InfoMessages.USER_SIGNUP_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const userLoginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.USER_LOGIN_STARTED);
        if (!req.body.email) {
            return next(new AppError(HttpCodes.NOT_FOUND, ErrorMessages.EMAIL_NOT_FOUND));
        }
        const email = req.body.email.toLowerCase();
        const data = await signInUserService(req.body.password, email);
        console.log(InfoMessages.USER_LOGIN_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const verifyUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.USER_VERIFYING);
        const data = await verifyUserService(req.body);
        console.log(InfoMessages.USER_VERIFICATION_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};