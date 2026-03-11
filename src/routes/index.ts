import {userRouter} from "./user.routes";
import {bodyMeasurementRouter} from "./bodyMeasurement.routes";
import {productRouter} from "./product.route";
import {cartRouter} from "./cart.router";
import {orderRouter} from "./order.router";
import {customOrderRouter} from "./custom-order.router";

export const routes = (app:any) => {
    app.use("/user", userRouter);
    app.use("/ai",bodyMeasurementRouter);
    app.use("/product", productRouter);
    app.use("/cart", cartRouter);
    app.use("/order", orderRouter);
    app.use("/custom-order", customOrderRouter);
};