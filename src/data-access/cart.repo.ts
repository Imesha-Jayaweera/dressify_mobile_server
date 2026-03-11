import { Cart } from "../models/cart.model";

export const findCartByUserIdRepo = (userId: any) => {
    return Cart.findOne({ userId }).populate('items.productId').exec();
};

export const createCartRepo = (data: any) => {
    return new Cart(data).save();
};

export const updateCartRepo = (userId: any, items: any) => {
    return Cart.findOneAndUpdate(
        { userId },
        { items },
        { new: true, upsert: true }
    ).populate('items.productId').exec();
};

export const deleteCartRepo = (userId: any) => {
    return Cart.deleteOne({ userId }).exec();
};