import {UserType} from "../constants/enums";
import {AppError} from "../util/app.error";
import {ErrorMessages, HttpCodes} from "../constants/messages";
import config from "config";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {createUserRefreshTokenRepo} from "../data-access/token.repo";

export const generateJWT = async (
    user: any,
    isRefresh = false
) => {
    let payload: any;

    switch (user.userType) {
        case UserType.CUSTOMER:
            payload = {
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                sex: user.sex,
                userType: user.userType,
            };
            break;

        case UserType.SHOPPING_CENTER:
        case UserType.TAILOR:
            payload = {
                userId: user._id.toString(),
                shopName: user.shopName,
                email: user.email,
                userType: user.userType,
            };
            break;

        default:
            throw new AppError(
                HttpCodes.BAD_REQUEST,
                ErrorMessages.INVALID_INPUT
            );
    }

    const accessToken = jwt.sign(
        payload,
        config.get<string>("auth.accessToken.secret"),
        {
            expiresIn: config.get("auth.accessToken.expiresIn"),
        }
    );

    if (isRefresh) {
        return { access_token: accessToken };
    }

    const refreshTokenId = uuidv4();

    await createUserRefreshTokenRepo({
        user: user._id,
        refreshToken: refreshTokenId,
    });

    const refreshToken = jwt.sign(
        { refreshToken: refreshTokenId },
        config.get<string>("auth.refreshToken.secret"),
        {
            expiresIn: config.get("auth.refreshToken.expiresIn"),
        }
    );

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: payload,
    };
};