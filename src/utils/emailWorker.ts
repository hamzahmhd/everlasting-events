console.log("Email worker is running and waiting for jobs...");

import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { sendEmail } from "./email";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null, // Required for BullMQ compatibility
});

const emailWorker = new Worker("emailQueue", async (job) => {
    const { to, subject, text, html } = job.data;
    console.log(`Processing email job for ${to}`);
    await sendEmail({ to, subject, text, html });
    console.log(`Email sent to ${to}`);
}, { connection });

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message || err);
    console.error("Full Error Details:", err); // Log the entire error for debugging
});

