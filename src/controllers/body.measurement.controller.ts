import { Request, Response } from "express";
import { bodyMeasurementService } from "../services/bodyMeasurement.service";

export const bodyMeasurementController = async (req: Request, res: Response) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ message: "Image is required" });

        const result = await bodyMeasurementService({ imageBase64 });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

