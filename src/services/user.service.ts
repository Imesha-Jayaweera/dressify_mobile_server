import Joi from "joi";
import {AppError} from "../util/app.error";
import {ErrorMessages, HttpCodes} from "../constants/messages";
import {generateOTP} from "../util/otp";
import {createUserRepo, findOneAndUpdateUserRepo, findOneUserRepo, userAggregationRepo} from "../data-access/user.repo";
import {IUser} from "../models/user.model";
import {
    createUserVerificationRepo,
    deleteUserVerificationRepo,
    findOneUserVerificationRepo
} from "../data-access/user.verification.repo";
import {sendEmailService} from "./email.service";
import {SETTINGS} from "../constants/commons.settings";
import {Sex, UserType} from "../constants/enums";
import bcrypt from "bcrypt";
import {generateJWT} from "./token.service";
import {IUserVerification} from "../models/user.verification.model";
import _ from "lodash";

const userJoiSchema = Joi.object({
    name: Joi.string().min(3).max(60).required().messages({
        "string.base": `"name" should be a type of 'text'`,
        "string.empty": `"name" cannot be an empty field`,
        "string.min": `"name" should have a minimum length of {#limit}`,
        "string.max": `"name" should have a maximum length of {#limit}`,
        "any.required": `"name" is a required field`,
    }),
    email: Joi.string().email().required().messages({
        "string.base": `"email" should be a type of 'text'`,
        "string.email": `"email" must be a valid email`,
        "string.empty": `"email" cannot be an empty field`,
        "any.required": `"email" is a required field`,
    }),
    password: Joi.string()
        .min(8)
        .max(30)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)
        .required()
        .messages({
            "string.base": `"password" should be a type of 'text'`,
            "string.pattern.base": `"password" must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character`,
            "string.empty": `"password" cannot be an empty field`,
            "string.min": `"password" should have a minimum length of {#limit}`,
            "string.max": `"password" should have a maximum length of {#limit}`,
            "any.required": `"password" is a required field`,
        }),
    birthDate: Joi.when("userType", {
        is: UserType.CUSTOMER,
        then: Joi.string()
            .isoDate()
            .required()
            .messages({
                "string.base": `"birthDate" should be a valid date`,
                "string.isoDate": `"birthDate" must be in ISO date format (YYYY-MM-DD)`,
                "any.required": `"birthDate" is required for customers`,
            }),
        otherwise: Joi.string()
            .isoDate()
            .optional(),
    }),
    address: Joi.string()
        .min(5)
        .max(255)
        .required()
        .messages({
            "string.base": `"address" should be a type of 'text'`,
            "string.empty": `"address" cannot be empty`,
            "any.required": `"address" is required`,
        }),
    userType: Joi.string()
        .valid(...Object.values(UserType))
        .required()
        .messages({
            "any.only": `"userType" must be a valid user type`,
            "any.required": `"userType" is required`,
        }),
    sex: Joi.when("userType", {
        is: UserType.CUSTOMER,
        then: Joi.string()
            .valid(...Object.values(Sex))
            .required()
            .messages({
                "any.only": `"sex" must be MALE, FEMALE, or OTHER`,
                "any.required": `"sex" is required for customers`,
            }),
        otherwise: Joi.string()
            .valid(...Object.values(Sex))
            .optional(),
    }),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{9,15}$/)
        .optional()
        .messages({
            "string.pattern.base": `"phoneNumber" must contain only numbers (9–15 digits)`,
        }),
    profileImage: Joi.string()
        .uri()
        .optional()
        .messages({
            "string.uri": `"profileImage" must be a valid URL`,
        }),
    shopName: Joi.when("userType", {
        is: Joi.valid(UserType.SHOPPING_CENTER, UserType.TAILOR),
        then: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                "any.required": `"shopName" is required for shopping centers and tailors`,
            }),
        otherwise: Joi.optional(),
    }),
    active: Joi.boolean().optional().messages({
        "boolean.base": `"status" should be a type of 'boolean'`,
        "any.required": `"status" is a required field`,
    }),
});

export const createUserService = async (data: any) => {
    const {error} = await userJoiSchema.validateAsync(data);
    if (error) {
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.VALIDATION_ERROR);
    }
    const verificationCode = generateOTP();
    const user: IUser = await createUserRepo({
        ...data,
    });
    await createUserVerificationRepo({
        userEmail: user.email,
        code: verificationCode,
    });
    sendEmailService(
        SETTINGS.EMAIL.VERIFICATION_CODE,
        {
            name: user.name,
            code: verificationCode,
        },
        user.email,
        "Verification Code"
    );
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

export const resendVerificationCodeService = async (email: string) => {
    const user: IUser | null = await findOneUserRepo({email});
    if (_.isEmpty(user)) {
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.USER_NOT_FOUND);
    }
    const verificationCode = generateOTP();
    await deleteUserVerificationRepo({userEmail: email});
    await createUserVerificationRepo({
        userEmail: user.email,
        code: verificationCode,
    });
    sendEmailService(
        SETTINGS.EMAIL.VERIFICATION_CODE,
        {
            name: user.name,
            code: verificationCode,
        },
        user.email,
        "Verification Code"
    );
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

const validateUser = async (password: any, user: any) => {
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.INVALID_CREDENTIALS);
    }
    if (!user.verified) {
        await resendVerificationCodeService(user.email);
        return {verificationRequired: true};
    }
    return await generateJWT(user, false, UserType.CUSTOMER);
};

export const signInUserService = async (password: any, email: any) => {
    const user = (
        await userAggregationRepo([
            {
                $match: {email},
            },
        ])
    )[0];
    if (!user) {
        throw new AppError(HttpCodes.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }
    if (!user.active) {
        throw new AppError(HttpCodes.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED_ACCESS);
    }
    return await validateUser(password, user);
};

export const verifyUserService = async (data: any) => {
    const {email, code} = data;
    const userVerification: IUserVerification | null = await findOneUserVerificationRepo({
        userEmail: email,
    });
    if (_.isEmpty(userVerification)) {
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.USER_NOT_FOUND);
    }
    if (userVerification.code.toString() === code.toString()) {
        const [user] = await Promise.all([
            findOneUserRepo({email}),
            findOneAndUpdateUserRepo({email}, {$set: {verified: true}}),
            deleteUserVerificationRepo({userEmail: email}),
        ]);
        return await generateJWT(user, false, UserType.CUSTOMER);
    } else {
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.INVALID_INPUT);
    }
};