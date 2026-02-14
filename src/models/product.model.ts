import {Document, model, Schema} from "mongoose";
import {BodyType, ProductCategory, Sex, Size} from "../constants/enums";

export interface IProduct extends Document {
    name: string;
    description?: string;
    category: ProductCategory;
    genderType: Sex;
    sizes: {
        size: Size;
        stock: number;
    }[];
    images: string[];
    price: number;
    colors: string[];
    suitableBodyTypes: BodyType[];
    shoppingCenterId: Schema.Types.ObjectId;
    totalStock: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: Object.values(ProductCategory),
            required: [true, "Product category is required"],
        },
        genderType: {
            type: String,
            enum: Object.values(Sex),
            required: [true, "Gender type is required"],
        },
        sizes: [
            {
                size: {
                    type: String,
                    enum: Object.values(Size),
                    required: true,
                },
                stock: {
                    type: Number,
                    required: true,
                    min: [0, "Stock cannot be negative"],
                    default: 0,
                },
            },
        ],
        images: {
            type: [String],
            required: [true, "At least one product image is required"],
            validate: {
                validator: function (images: string[]) {
                    return images.length > 0;
                },
                message: "Product must have at least one image",
            },
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        colors: {
            type: [String],
            required: [true, "At least one color is required"],
            validate: {
                validator: function (colors: string[]) {
                    return colors.length > 0;
                },
                message: "Product must have at least one color",
            },
        },
        suitableBodyTypes: {
            type: [String],
            enum: Object.values(BodyType),
            default: [BodyType.ALL],
        },
        shoppingCenterId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Shopping center ID is required"],
            validate: {
                validator: async function (id: Schema.Types.ObjectId) {
                    const User = model("User");
                    const user = await User.findById(id);
                    return user?.userType === "SHOPPING_CENTER";
                },
                message: "Invalid shopping center ID",
            },
        },
        totalStock: {
            type: Number,
            default: 0,
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save middleware to calculate total stock
ProductSchema.pre<IProduct>("save", function () {
    this.totalStock = this.sizes.reduce((total, sizeItem) => {
        return total + sizeItem.stock;
    }, 0);

    // Auto-set availability based on stock
    this.isAvailable = this.totalStock > 0;

});

// Index for better query performance
// ProductSchema.index({ shoppingCenterId: 1 });
// ProductSchema.index({ category: 1, genderType: 1 });
// ProductSchema.index({ price: 1 });
// ProductSchema.index({ suitableBodyTypes: 1 });

export const Product = model<IProduct>("Product", ProductSchema);