import config from "config";
import mongoose from "mongoose";

export const initDatabase = async () => {
    try {
        mongoose.Promise = global.Promise;
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.get("db.path"), {});
        console.log("MongoDB Atlas connected");
    } catch (e) {
        console.log(`Database connection failed - ${JSON.stringify(e)}`);
    }
};
