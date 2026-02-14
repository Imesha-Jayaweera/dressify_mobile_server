import {NextFunction,Request, Response} from "express";
import {
    createProductService, deleteProductService,
    getMyProductsService,
    getProductByIdService,
    updateProductService
} from "../services/product.service";
import {InfoMessages} from "../constants/messages";

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_CREATE_STARTED);
        const data = await createProductService(req.body);
        console.log(InfoMessages.PRODUCT_CREATE_SUCCESSFUL);
        res.status(201).send(data);
    } catch (e) {
        next(e);
    }
};


export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(InfoMessages.PRODUCT_UPDATE_STARTED);
        const data = await updateProductService(req.params.id, req.body);
        console.log(InfoMessages.PRODUCT_UPDATE_SUCCESSFUL);
        res.send(data);
    } catch (e) {
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

