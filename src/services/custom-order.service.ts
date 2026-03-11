import { AppError } from "../util/app.error";
import { ErrorMessages, HttpCodes } from "../constants/messages";
import {
    createCustomOrderRepo,
    findCustomOrdersByTailorRepo,
    findCustomOrdersByCustomerRepo,
    updateCustomOrderStatusRepo,
} from "../data-access/custom-order.repo";
import { findProductByIdRepo } from "../data-access/product.repo";

export const createCustomOrderService = async (data: any) => {
    const { customerId, customerName, customerEmail, customerPhone, productId, quantity, selectedColor, additionalNotes } = data;

    // Validate product exists
    const product = await findProductByIdRepo({ _id: productId });
    if (!product) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product not found");
    }

    // Create custom order
    const customOrder = await createCustomOrderRepo({
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        tailorId: product.shoppingCenterId, // This is actually the tailor ID
        productId: product._id,
        productName: product.name,
        productImage: product.images[0] || "",
        quantity,
        selectedColor,
        additionalNotes,
    });

    return { success: true, data: customOrder };
};

export const getTailorCustomOrdersService = async (tailorId: any) => {
    const orders = await findCustomOrdersByTailorRepo(tailorId);
    return { success: true, data: orders };
};

export const getCustomerCustomOrdersService = async (customerId: any) => {
    const orders = await findCustomOrdersByCustomerRepo(customerId);
    return { success: true, data: orders };
};

export const updateCustomOrderStatusService = async (orderId: any, status: string) => {
    const order = await updateCustomOrderStatusRepo(orderId, status);
    if (!order) {
        throw new AppError(HttpCodes.NOT_FOUND, "Custom order not found");
    }
    return { success: true, data: order };
};