import ejs from "ejs";
import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
import { SETTINGS } from "../constants/commons.settings";

export const sendEmailService = async (template:any, data:any, to:any, subject:any, file?:any) => {
    const filePath = path.join(__dirname, `../html-templates/${template}`);
    const html = fs.readFileSync(filePath, "utf8");
    const parsed = ejs.render(html, data);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SETTINGS.EMAIL_CONFIG.username,
            pass: SETTINGS.EMAIL_CONFIG.password,
        },
    });

    const attachments = file
        ? [{ filename: file.fileName, content: file.stream }]
        : [];

    await transporter.sendMail({
        from: `Dressify <${SETTINGS.EMAIL_CONFIG.username}>`,
        to,
        subject,
        html: parsed,
        attachments,
    });
};

