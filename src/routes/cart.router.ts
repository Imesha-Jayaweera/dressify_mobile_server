import { Router } from "express";
import {
    getCartController,
    updateCartController,
    clearCartController,
} from "../controllers/cart.controller";

export const cartRouter = Router();

cartRouter.get("/:userId", getCartController);
cartRouter.put("/:userId", updateCartController);
cartRouter.delete("/:userId", clearCartController);