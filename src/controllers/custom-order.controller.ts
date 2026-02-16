import { NextFunction, Request, Response } from "express";
import {
    createCustomOrderService,
    getTailorCustomOrdersService,
    getCustomerCustomOrdersService,
    updateCustomOrderStatusService,
} from "../services/custom-order.service";

export const createCustomOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("📦 Creating custom order...");
        const data = await createCustomOrderService(req.body);
        console.log("✅ Custom order created successfully");
        res.status(201).send(data);
    } catch (e) {
        console.error("❌ Create custom order error:", e);
        next(e);
    }
};

export const getTailorCustomOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tailorId = req.params.tailorId;
        const data = await getTailorCustomOrdersService(tailorId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const getCustomerCustomOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerId = req.params.customerId;
        const data = await getCustomerCustomOrdersService(customerId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const updateCustomOrderStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;
        const data = await updateCustomOrderStatusService(orderId, status);
        res.send(data);
    } catch (e) {
        next(e);
    }
};