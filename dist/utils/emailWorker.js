"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Email worker is running and waiting for jobs...");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bullmq_1 = require("bullmq");
const email_1 = require("./email");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null, // Required for BullMQ compatibility
});
const emailWorker = new bullmq_1.Worker("emailQueue", async (job) => {
    const { to, subject, text, html } = job.data;
    console.log(`Processing email job for ${to}`);
    await (0, email_1.sendEmail)({ to, subject, text, html });
    console.log(`Email sent to ${to}`);
}, { connection });
emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});
emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err.message || err);
    console.error("Full Error Details:", err); // Log the entire error for debugging
});
