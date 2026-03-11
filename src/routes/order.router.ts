import { Router } from "express";
import {
    createOrderController,
    getCustomerOrdersController,
    getShoppingCenterOrdersController,
    updateOrderStatusController,
} from "../controllers/order.controller";

export const orderRouter = Router();

orderRouter.post("/", createOrderController);
orderRouter.get("/customer/:customerId", getCustomerOrdersController);
orderRouter.get("/shopping-center/:shoppingCenterId", getShoppingCenterOrdersController);
orderRouter.put("/:orderId/status", updateOrderStatusController);