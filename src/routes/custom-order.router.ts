import { Router } from "express";
import {
    createCustomOrderController,
    getTailorCustomOrdersController,
    getCustomerCustomOrdersController,
    updateCustomOrderStatusController,
} from "../controllers/custom-order.controller";

export const customOrderRouter = Router();

customOrderRouter.post("/", createCustomOrderController);
customOrderRouter.get("/tailor/:tailorId", getTailorCustomOrdersController);
customOrderRouter.get("/customer/:customerId", getCustomerCustomOrdersController);
customOrderRouter.put("/:orderId/status", updateCustomOrderStatusController);