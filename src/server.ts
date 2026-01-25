import bodyParser from "body-parser";
import config from "config";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { initDatabase } from "./data-access";
import { routes } from "./routes";
import dotenv from "dotenv";
dotenv.config();
// import { errorHandler } from "./util/app.error";

const app = express();
const port = process.env.PORT || config.get("server.port") || 3000;

// Database initiation
initDatabase();

// Server configuration
app.set("trust proxy", true);
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());
app.use(fileUpload({
    limits: {
        fileSize: 1000000 * 10 //10mb
    },
    abortOnLimit: true
}));


// Routes initialization
routes(app);
// app.use(errorHandler);

app.listen(port, () => {
    // exampleFlow().then().catch(e => console.log(e));
    console.log(`Dressify API Server v${process.env.npm_package_version} started on PORT ${port}`);
});
