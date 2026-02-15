import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import express from "express";
import { initDatabase } from "./data-access";
import { routes } from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || config.get("server.port") || 3000;

// Database initiation
initDatabase();

app.set("trust proxy", true);

app.use(cors());

app.use((req, res, next) => {
    const contentType = req.get('Content-Type') || '';

    // Skip body parser for multipart requests (Cloudinary/Multer will handle them)
    if (contentType.includes('multipart/form-data')) {
        console.log('⏭️  Skipping body parser for multipart request');
        return next();
    }

    // Apply body parser for non-multipart requests
    bodyParser.urlencoded({ limit: "50mb", extended: true })(req, res, next);
});

app.use((req, res, next) => {
    const contentType = req.get('Content-Type') || '';

    if (contentType.includes('multipart/form-data')) {
        return next();
    }

    bodyParser.json({ limit: "50mb" })(req, res, next);
});

// Routes initialization
routes(app);

app.listen(port, () => {
    console.log(`✅ Dressify API Server v${process.env.npm_package_version} started on PORT ${port}`);
});
