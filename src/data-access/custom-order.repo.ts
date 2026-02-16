import { CustomOrder } from "../models/custom-order.model";

export const createCustomOrderRepo = (data: any) => {
    return new CustomOrder(data).save();
};

export const findCustomOrdersByTailorRepo = (tailorId: any) => {
    return CustomOrder.find({ tailorId }).sort({ createdAt: -1 }).exec();
};

export const findCustomOrdersByCustomerRepo = (customerId: any) => {
    return CustomOrder.find({ customerId }).sort({ createdAt: -1 }).exec();
};

export const findCustomOrderByIdRepo = (orderId: any) => {
    return CustomOrder.findById(orderId).exec();
};

export const updateCustomOrderStatusRepo = (orderId: any, status: string) => {
    return CustomOrder.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    ).exec();
};