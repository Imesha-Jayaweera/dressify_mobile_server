import {Router} from "express";
import {analyzeBody} from "../controllers/bodyMeasurement.controller";
import multer from "multer";
export const bodyMeasurementRouter = Router();

bodyMeasurementRouter.post("/analyze",analyzeBody);
