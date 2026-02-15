import { Router } from "express";
import {
    createProductController,
    deleteProductController,
    getMyProductsController,
    getProductByIdController,
    updateProductController
} from "../controllers/product.controller";
import { uploadProductImages } from "../config/cloudinary.config";
export const productRouter = Router();

productRouter.post("/", uploadProductImages, createProductController);
productRouter.put("/:id", updateProductController);
productRouter.get("/my-products/:shoppingCenterId", getMyProductsController);
productRouter.get("/:id", getProductByIdController);
productRouter.delete("/:id", deleteProductController);