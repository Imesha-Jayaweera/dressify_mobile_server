import { Request, Response } from "express";
import { getBodyMeasurements } from "../services/bodyMeasurement.service";

export const analyzeBody = async (req: Request, res: Response) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ message: "Image is required" });

        const result = await getBodyMeasurements({ imageBase64 });
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};

