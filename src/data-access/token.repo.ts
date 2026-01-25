import {RefreshToken} from "../models/user.token.model";

export const createUserRefreshTokenRepo = (data:any) => {
    return new RefreshToken(data).save();
};