import { AppError } from "../util/app.error";
import { ErrorMessages, HttpCodes } from "../constants/messages";
import {
    createOrderRepo,
    findOrdersByCustomerRepo,
    findOrdersByShoppingCenterRepo,
    findOrderByIdRepo,
    updateOrderStatusRepo,
} from "../data-access/order.repo";
import { findProductByIdRepo, updateProductRepo } from "../data-access/product.repo";
import { deleteCartRepo } from "../data-access/cart.repo";

export const createOrderService = async (data: any) => {
    const { customerId, customerName, customerEmail, customerPhone, shippingAddress, items } = data;

    // Validate that items array is not empty
    if (!items || items.length === 0) {
        throw new AppError(HttpCodes.BAD_REQUEST, "Order must contain at least one item");
    }

    // Validate stock and prepare order items
    let totalAmount = 0;
    const orderItems = [];
    let shoppingCenterId = null;

    for (const item of items) {
        const product = await findProductByIdRepo({ _id: item.productId });

        if (!product) {
            throw new AppError(HttpCodes.NOT_FOUND, `Product ${item.productId} not found`);
        }

        // Set shopping center ID from first product
        if (!shoppingCenterId) {
            shoppingCenterId = product.shoppingCenterId;
        }

        // Check if color is available
        if (!product.colors.includes(item.color)) {
            throw new AppError(
                HttpCodes.BAD_REQUEST,
                `Color ${item.color} not available for ${product.name}`
            );
        }

        // Check stock
        const sizeStock = product.sizes.find((s: any) => s.size === item.size);
        if (!sizeStock) {
            throw new AppError(
                HttpCodes.BAD_REQUEST,
                `Size ${item.size} not available for ${product.name}`
            );
        }

        if (sizeStock.stock < item.quantity) {
            throw new AppError(
                HttpCodes.BAD_REQUEST,
                `Insufficient stock for ${product.name} - Size ${item.size}. Available: ${sizeStock.stock}, Requested: ${item.quantity}`
            );
        }

        // Deduct stock
        const updatedSizes = product.sizes.map((s: any) => {
            if (s.size === item.size) {
                return {
                    size: s.size,
                    stock: s.stock - item.quantity,
                    _id: s._id
                };
            }
            return s;
        });

        await updateProductRepo({ _id: product._id }, { sizes: updatedSizes });

        orderItems.push({
            productId: product._id,
            productName: product.name,
            price: product.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: product.images[0] || "",
        });

        totalAmount += product.price * item.quantity;
    }

    // Validate shopping center ID exists
    if (!shoppingCenterId) {
        throw new AppError(HttpCodes.BAD_REQUEST, "Could not determine shopping center for order");
    }

    // Create order
    const order = await createOrderRepo({
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        items: orderItems,
        totalAmount,
        shoppingCenterId,
    });

    // Clear customer's cart after successful order
    try {
        await deleteCartRepo(customerId);
        console.log('✅ Cart cleared after order');
    } catch (e) {
        console.log('⚠️ Cart clear failed (might be empty):', e);
        // Don't fail the order if cart clear fails
    }

    return { success: true, data: order };
};

export const getCustomerOrdersService = async (customerId: any) => {
    const orders = await findOrdersByCustomerRepo(customerId);
    return { success: true, data: orders };
};

export const getShoppingCenterOrdersService = async (shoppingCenterId: any) => {
    const orders = await findOrdersByShoppingCenterRepo(shoppingCenterId);
    return { success: true, data: orders };
};

export const updateOrderStatusService = async (orderId: any, status: string) => {
    const order = await updateOrderStatusRepo(orderId, status);
    if (!order) {
        throw new AppError(HttpCodes.NOT_FOUND, "Order not found");
    }
    return { success: true, data: order };
};