"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configure the transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com", // Fallback in case environment variable is missing
    port: parseInt(process.env.SMTP_PORT || "587", 10), // Parse and provide a default
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER || "", // Provide a fallback or handle undefined case
        pass: process.env.SMTP_PASSWORD || "", // Provide a fallback or handle undefined case
    },
});
console.log("SMTP Config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
});
// Reusable function to send emails
async function sendEmail({ to, subject, text, html, }) {
    try {
        const info = await transporter.sendMail({
            from: `"Everlasting Events" <${process.env.SMTP_USER || "no-reply@example.com"}>`, // Fallback in case user is not defined
            to,
            subject,
            text,
            html,
        });
        console.log("Email sent successfully:", info.messageId);
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent.");
    }
}
