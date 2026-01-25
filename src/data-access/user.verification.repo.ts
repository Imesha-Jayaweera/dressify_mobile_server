import {UserVerification} from "../models/user.verification.model";

export const createUserVerificationRepo = (data:any) => {
    return new UserVerification(data).save();
};

export const deleteUserVerificationRepo = (filters:any) => {
    return UserVerification.deleteMany(filters).exec();
};

export const findOneUserVerificationRepo = (filters:any) => {
    return UserVerification.findOne(filters).sort({ createdAt: -1 }).exec();
};