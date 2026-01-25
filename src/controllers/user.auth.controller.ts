import {NextFunction, Response} from "express";
import {IRequest} from "../constants/request";
import {ErrorMessages, HttpCodes, InfoMessages} from "../constants/messages";
import {createUserService, signInUserService, verifyUserService} from "../services/user.service";
import {AppError} from "../util/app.error";

export const userSignUpController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        req.log?.info(InfoMessages.USER_SIGNUP_STARTED);
        const data = await createUserService(req.body);
        req.log?.info(InfoMessages.USER_SIGNUP_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const userLoginController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        req.log?.info(InfoMessages.USER_LOGIN_STARTED);
        if (!req.body.email) {
            return next(new AppError(HttpCodes.NOT_FOUND, ErrorMessages.EMAIL_NOT_FOUND));
        }
        const email = req.body.email.toLowerCase();
        const data = await signInUserService(req.body.password, email);
        req.log?.info(InfoMessages.USER_LOGIN_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const verifyUserController = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        req.log?.info(InfoMessages.USER_VERIFYING);
        const data = await verifyUserService(req.body);
        req.log?.info(InfoMessages.USER_VERIFICATION_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};