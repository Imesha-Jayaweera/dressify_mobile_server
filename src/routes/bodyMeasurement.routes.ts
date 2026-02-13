import {Router} from "express";
import {bodyMeasurementController} from "../controllers/body.measurement.controller";
import multer from "multer";
export const bodyMeasurementRouter = Router();

bodyMeasurementRouter.post("/analyze",bodyMeasurementController);
