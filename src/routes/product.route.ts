import {Router} from "express";
import {
    createProductController, deleteProductController,
    getMyProductsController, getProductByIdController,
    updateProductController
} from "../controllers/product.controller";
import {upload} from "../middleware/upload.middleware";
export const productRouter = Router();

productRouter.post("/", upload.array('images', 10), createProductController);
productRouter.put("/:id", updateProductController);
productRouter.get("/my-products/:shoppingCenterId", getMyProductsController);
productRouter.get("/:id", getProductByIdController);
productRouter.delete("/:id", deleteProductController);