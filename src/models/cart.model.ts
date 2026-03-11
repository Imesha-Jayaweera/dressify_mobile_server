import { Document, model, Schema } from "mongoose";

export interface ICartItem {
    productId: Schema.Types.ObjectId;
    quantity: number;
    size: string;
    color: string;
}

export interface ICart extends Document {
    userId: Schema.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

const CartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        items: [CartItemSchema],
    },
    {
        timestamps: true,
    }
);

export const Cart = model<ICart>("Cart", CartSchema);