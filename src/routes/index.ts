import {userRouter} from "./user.routes";
import {bodyMeasurementRouter} from "./bodyMeasurement.routes";
import {productRouter} from "./product.route";

export const routes = (app:any) => {
    app.use("/user", userRouter);
    app.use("/ai",bodyMeasurementRouter);
    app.use("/product", productRouter);
};