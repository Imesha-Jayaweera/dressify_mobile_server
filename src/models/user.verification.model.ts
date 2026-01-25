import { Document, model, Schema } from "mongoose";

export interface IUserVerification extends Document {
    userEmail: string;
    code: string;
    createdAt: any;
    updatedAt: any;
    __v: any;
}

export const UserVerificationSchema = new Schema<IUserVerification>(
    {
        userEmail: {
            type: Schema.Types.String,
            required: [true, "User email is required"],
        },
        code: {
            type: Schema.Types.String,
            required: [true, "Code is required"],
        },
    },
    {
        timestamps: true,
    }
);

export const UserVerification = model<IUserVerification>(
    "UserVerification",
    UserVerificationSchema
);
