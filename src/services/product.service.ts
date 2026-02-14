import {AppError} from "../util/app.error";
import Joi from "joi";
import {ErrorMessages, HttpCodes} from "../constants/messages";
import {
    createProductRepo, deleteProductRepo,
    findProductByIdRepo,
    findProductsByShoppingCenterRepo,
    updateProductRepo
} from "../data-access/product.repo";

const productJoiSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    category: Joi.string().required(),
    genderType: Joi.string().required(),
    sizes: Joi.array().items(
        Joi.object({
            size: Joi.string().required(),
            stock: Joi.number().min(0).required()
        })
    ).required(),
    images: Joi.array().items(Joi.string()).min(1).required(),
    price: Joi.number().min(0).required(),
    colors: Joi.array().items(Joi.string()).min(1).required(),
    suitableBodyTypes: Joi.array().items(Joi.string()).optional(),
    shoppingCenterId: Joi.string().required()
});

export const createProductService = async (data: any) => {
    if (typeof data.sizes === "string") {
        data.sizes = JSON.parse(data.sizes);
    }
    if (typeof data.colors === "string") {
        data.colors = JSON.parse(data.colors);
    }

    if (typeof data.suitableBodyTypes === "string") {
        data.suitableBodyTypes = JSON.parse(data.suitableBodyTypes);
    }

    if (typeof data.images === "string") {
        data.images = JSON.parse(data.images);
    }

    if (typeof data.price === "string") {
        data.price = Number(data.price);
    }
    const { error } = productJoiSchema.validate(data);
    console.log("DATA",data);
    if (error) {
        console.log(error)
        throw new AppError(HttpCodes.BAD_REQUEST, ErrorMessages.VALIDATION_ERROR);
    }
    const product = await createProductRepo(data);
    return product;
};

export const updateProductService = async (id: any, data: any) => {
    const existing = await findProductByIdRepo({ _id: id });
    if (!existing) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product Not Found");
    }
    return await updateProductRepo({ _id: id }, data);
};

export const getMyProductsService = async (shoppingCenterId: any) => {
    return await findProductsByShoppingCenterRepo({ shoppingCenterId });
};

export const getProductByIdService = async (id:any) => {
    const product = await findProductByIdRepo({ _id: id });
    if (!product) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product Not Found");
    }
    return product;
};

export const deleteProductService = async (id:any) => {
    const product = await findProductByIdRepo({ _id: id });
    if (!product) {
        throw new AppError(HttpCodes.NOT_FOUND, "Product Not Found");
    }
    return await deleteProductRepo({ _id: id });
};