import { AppError } from "../util/app.error";
import { ErrorMessages, HttpCodes } from "../constants/messages";
import {
    findCartByUserIdRepo,
    updateCartRepo,
    deleteCartRepo,
} from "../data-access/cart.repo";

export const getCartService = async (userId: any) => {
    const cart = await findCartByUserIdRepo(userId);
    return { success: true, data: cart || { items: [] } };
};

export const updateCartService = async (userId: any, items: any) => {
    // Validate items structure
    if (!Array.isArray(items)) {
        throw new AppError(HttpCodes.BAD_REQUEST, "Items must be an array");
    }

    const cart = await updateCartRepo(userId, items);
    return { success: true, data: cart };
};

export const clearCartService = async (userId: any) => {
    await deleteCartRepo(userId);
    return { success: true, message: "Cart cleared" };
};