import { Order } from "../models/order.model";

export const createOrderRepo = (data: any) => {
    return new Order(data).save();
};

export const findOrdersByCustomerRepo = (customerId: any) => {
    return Order.find({ customerId }).sort({ createdAt: -1 }).exec();
};

export const findOrdersByShoppingCenterRepo = (shoppingCenterId: any) => {
    return Order.find({ shoppingCenterId }).sort({ createdAt: -1 }).exec();
};

export const findOrderByIdRepo = (orderId: any) => {
    return Order.findById(orderId).exec();
};

export const updateOrderStatusRepo = (orderId: any, status: string) => {
    return Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    ).exec();
};