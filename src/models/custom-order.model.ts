import { Document, model, Schema } from "mongoose";

export enum CustomOrderStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    PROCESSING = "PROCESSING",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
}

export interface ICustomOrder extends Document {
    customerId: Schema.Types.ObjectId;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tailorId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    productName: string;
    productImage: string;
    quantity: number;
    selectedColor: string;
    additionalNotes?: string;
    status: CustomOrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

const CustomOrderSchema = new Schema<ICustomOrder>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        tailorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        productImage: {
            type: String,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        selectedColor: {
            type: String,
            required: true,
        },
        additionalNotes: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(CustomOrderStatus),
            default: CustomOrderStatus.PENDING,
        },
    },
    {
        timestamps: true,
    }
);

export const CustomOrder = model<ICustomOrder>("CustomOrder", CustomOrderSchema);