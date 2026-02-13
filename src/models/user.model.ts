import {Document, model, Schema} from "mongoose";
import {Sex, UserType} from "../constants/enums";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    birthDate: string;
    address: string;
    userType: UserType;
    sex: Sex;
    phoneNumber?: string;
    profileImage?: string;
    shopName?: string;
    active: boolean;
    verified: boolean;
    createdAt: any;
    updatedAt: any;
    __v: any;
}

export const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "First name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: Schema.Types.String,
        },
        birthDate: {
            type: String,
        },
        address: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            enum: Object.values(UserType),
            required: true,
        },
        sex: {
            type: String,
            enum: Object.values(Sex),
        },
        phoneNumber: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        shopName: {
            type: String,
            // required only for Shopping Center & Tailor (we’ll validate later)
        },
        active: {
            type: Boolean,
            default: true
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

UserSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

export const User = model<IUser>("User", UserSchema);
