import { NextFunction, Request, Response } from "express";
import {
    createProductService,
    deleteProductService, getAllProductsService,
    getMyProductsService,
    getProductByIdService, getRecommendedProductsService,
    updateProductService
} from "../services/product.service";
import { InfoMessages } from "../constants/messages";

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_CREATE_STARTED);

        // ✅ Extract Cloudinary URLs from uploaded files
        const images: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            images.push(...req.files.map((file: any) => {
                // Cloudinary files have a 'path' property with the full URL
                console.log("✅ Uploaded to Cloudinary:", file.path);
                return file.path; // This is the Cloudinary URL
            }));
        }

        console.log("✅ Cloudinary image URLs:", images);

        // ✅ Add images to the request body
        const productData = {
            ...req.body,
            images: images
        };

        const data = await createProductService(productData);
        console.log(InfoMessages.PRODUCT_CREATE_SUCCESSFUL);
        res.status(201).send(data);
    } catch (e) {
        console.error("❌ Create product error:", e);
        next(e);
    }
};

export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_UPDATE_STARTED);
        console.log("📝 Update request body:", req.body);

        const data = await updateProductService(req.params.id, req.body);
        console.log(InfoMessages.PRODUCT_UPDATE_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        console.error("Update product error:", e);
        next(e);
    }
};

export const getMyProductsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_FETCH_BY_SHOP_STARTED);
        const data = await getMyProductsService(req.params.shoppingCenterId);
        console.log(InfoMessages.PRODUCT_FETCH_BY_SHOP_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_FETCH_BY_ID_STARTED);
        const data = await getProductByIdService(req.params.id);
        console.log(InfoMessages.PRODUCT_FETCH_BY_ID_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_DELETE_STARTED);
        const data = await deleteProductService(req.params.id);
        console.log(InfoMessages.PRODUCT_DELETE_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const getAllProductsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_FETCH_ALL_STARTED);
        const filters = req.query; // Get filters from query params
        const data = await getAllProductsService(filters);
        console.log(InfoMessages.PRODUCT_FETCH_ALL_SUCCESSFUL);
        res.send(data);
    } catch (e) {
        next(e);
    }
};

export const getRecommendedProductsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('📦 Getting recommended products...');
        const filters = req.query;
        const data = await getRecommendedProductsService(filters);
        res.send(data);
    } catch (e) {
        console.error('❌ Get recommended products error:', e);
        next(e);
    }
};