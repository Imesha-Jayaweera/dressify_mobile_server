import {userRouter} from "./user.routes";
import {bodyMeasurementRouter} from "./bodyMeasurement.routes";

export const routes = (app:any) => {
    app.use("/user", userRouter);
    app.use("/ai",bodyMeasurementRouter);
};