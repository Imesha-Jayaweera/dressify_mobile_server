import { NextFunction, Request, Response } from "express";
import {
    createOrderService,
    getCustomerOrdersService,
    getShoppingCenterOrdersService,
    updateOrderStatusService,
} from "../services/order.service";

export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("📦 Creating order...");
        const data = await createOrderService(req.body);
        console.log("✅ Order created successfully");
        res.status(201).send(data);
    } catch (e) {
        console.error("❌ Create order error:", e);
        next(e);
    }
};

export const getCustomerOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId = req.params.customerId;
        const data = await getCustomerOrdersService(customerId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const getShoppingCenterOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shoppingCenterId = req.params.shoppingCenterId;
        const data = await getShoppingCenterOrdersService(shoppingCenterId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const updateOrderStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        const data = await updateOrderStatusService(orderId, status);
        res.send(data);
    } catch (e) {
        next(e);
    }
};