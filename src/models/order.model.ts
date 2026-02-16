import { Document, model, Schema } from "mongoose";

export enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    ONGOING = "ONGOING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface IOrderItem {
    productId: Schema.Types.ObjectId;
    productName: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
}

export interface IOrder extends Document {
    customerId: Schema.Types.ObjectId;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shoppingCenterId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
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
    image: {
        type: String,
    },
});

const OrderSchema = new Schema<IOrder>(
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
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        items: [OrderItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        shoppingCenterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Order = model<IOrder>("Order", OrderSchema);