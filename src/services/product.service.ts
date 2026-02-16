import { AppError } from "../util/app.error";
import Joi from "joi";
import { ErrorMessages, HttpCodes } from "../constants/messages";
import {
    createProductRepo,
    deleteProductRepo, findAllProductsRepo,
    findProductByIdRepo,
    findProductsByShoppingCenterRepo,
    updateProductRepo
} from "../data-access/product.repo";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";

const productJoiSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    category: Joi.string().required(),
    genderType: Joi.string().required(),
    sizes: Joi.array().items(
        Joi.object({
            size: Joi.string().required(),
            stock: Joi.number().min(0).required()
        })
    ).required(),
    images: Joi.array().items(Joi.string()).min(0).optional(),
    price: Joi.number().min(0).required(),
    colors: Joi.array().items(Joi.string()).min(1).required(),
    suitableBodyTypes: Joi.array().items(Joi.string()).optional(),
    shoppingCenterId: Joi.string().required()
});

const updateProductJoiSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    category: Joi.string().optional(),
    genderType: Joi.string().optional(),
    sizes: Joi.array().items(
        Joi.object({
            size: Joi.string().required(),
            stock: Joi.number().min(0).required()
        })
    ).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    price: Joi.number().min(0).optional(),
    colors: Joi.array().items(Joi.string()).min(1).optional(),
    suitableBodyTypes: Joi.array().items(Joi.string()).optional(),
});

export const createProductService = async (data: any) => {
    console.log("🔍 CREATE SERVICE - Raw data:", data);

    if (typeof data.sizes === "string") {
        data.sizes = JSON.parse(data.sizes);
    }
    if (typeof data.colors === "string") {
        data.colors = JSON.parse(data.colors);
    }
    if (typeof data.suitableBodyTypes === "string") {
        data.suitableBodyTypes = JSON.parse(data.suitableBodyTypes);
    }
    if (typeof data.price === "string") {
        data.price = Number(data.price);
    }

    console.log("🔍 CREATE SERVICE - Parsed data:", data);
    console.log("🖼️ CREATE SERVICE - Cloudinary URLs:", data.images);

    const { error } = productJoiSchema.validate(data);
    if (error) {
        console.log("❌ Validation error:", error.details);
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.VALIDATION_ERROR);
    }

    const product = await createProductRepo(data);
    console.log("✅ Product created with Cloudinary images:", product.images);

    return { success: true, data: product };
};

export const updateProductService = async (id: any, data: any) => {
    console.log("📝 UPDATE SERVICE - Received data:", data);

    const existing = await findProductByIdRepo({ _id: id });
    if (!existing) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product Not Found");
    }

    if (typeof data.sizes === "string") {
        data.sizes = JSON.parse(data.sizes);
    }
    if (typeof data.colors === "string") {
        data.colors = JSON.parse(data.colors);
    }
    if (typeof data.suitableBodyTypes === "string") {
        data.suitableBodyTypes = JSON.parse(data.suitableBodyTypes);
    }
    if (typeof data.price === "string") {
        data.price = Number(data.price);
    }

    console.log("📝 UPDATE SERVICE - Parsed data:", data);

    const { error } = updateProductJoiSchema.validate(data);
    if (error) {
        console.log("❌ Validation error:", error);
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.VALIDATION_ERROR);
    }

    const updatedProduct = await updateProductRepo({ _id: id }, data);

    console.log("✅ UPDATE SERVICE - Updated product totalStock:", updatedProduct?.totalStock);

    return { success: true, data: updatedProduct };
};

export const getMyProductsService = async (shoppingCenterId: any) => {
    const products = await findProductsByShoppingCenterRepo({ shoppingCenterId });
    return { success: true, data: products };
};

export const getProductByIdService = async (id: any) => {
    const product = await findProductByIdRepo({ _id: id });
    if (!product) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product Not Found");
    }
    return { success: true, data: product };
};

export const deleteProductService = async (id: any) => {
    const product = await findProductByIdRepo({ _id: id });
    if (!product) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product Not Found");
    }

    // ✅ Delete images from Cloudinary before deleting product
    if (product.images && product.images.length > 0) {
        console.log(`🗑️ Deleting ${product.images.length} images from Cloudinary...`);

        for (const imageUrl of product.images) {
            try {
                await deleteImageFromCloudinary(imageUrl);
                console.log(`✅ Deleted image from Cloudinary: ${imageUrl}`);
            } catch (error) {
                console.error(`❌ Failed to delete image: ${imageUrl}`, error);
                // Continue even if some images fail to delete
            }
        }
    }

    await deleteProductRepo({ _id: id });
    console.log(`✅ Product deleted: ${id}`);

    return { success: true, message: "Product deleted successfully" };
};

export const getAllProductsService = async (filters: any) => {
    const query: any = { isAvailable: true }; // Only show available products

    if (filters.genderType) query.genderType = filters.genderType;
    if (filters.category) query.category = filters.category;
    if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
        if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }
    if (filters.size) {
        query['sizes.size'] = filters.size;
        query['sizes.stock'] = { $gt: 0 }; // Only show products with stock in that size
    }
    if (filters.bodyType) {
        query.suitableBodyTypes = { $in: [filters.bodyType, 'ALL'] };
    }

    const products = await findAllProductsRepo(query);
    return { success: true, data: products };
};