import {Product} from "../models/product.model";

export const createProductRepo = (data: any) => {
    return new Product(data).save();
};

export const updateProductRepo = (filters: any, data: any) => {
    return Product.findOneAndUpdate(filters, data, { new: true }).exec();
};

export const findProductsByShoppingCenterRepo = (filters: any) => {
    return Product.find(filters).exec();
};

export const findProductByIdRepo = (filters: any) => {
    return Product.findOne(filters).exec();
};

export const deleteProductRepo = (filters: any) => {
    return Product.deleteOne(filters).exec();
};

// Fetch all products with filters (for customer shop page)
export const findAllProductsRepo = (filters: any) => {
    return Product.find(filters).populate('shoppingCenterId', 'userType businessName contactNumber').exec();
};