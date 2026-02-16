import { NextFunction, Request, Response } from "express";
import {
    getCartService,
    updateCartService,
    clearCartService,
} from "../services/cart.service";

export const getCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const data = await getCartService(userId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const updateCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const { items } = req.body;
        const data = await updateCartService(userId, items);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const clearCartController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        const data = await clearCartService(userId);
        res.send(data);
    } catch (e) {
        next(e);
    }
};