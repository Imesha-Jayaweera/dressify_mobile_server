import {User} from "../models/user.model";

export const createUserRepo = (data:any) => {
    return new User(data).save();
};
export const userAggregationRepo = (pipeline:any) => {
    return User.aggregate(pipeline).exec();
};

export const findOneUserRepo = (filters:any, projection?:any) => {
    return User.findOne(filters, projection).exec();
};

export const findOneAndUpdateUserRepo = async (filters:any, update:any, options?:any) => {
    return User.findOneAndUpdate(filters, update, options).exec();
};