import * as dotenv from "dotenv";

dotenv.config();

import { Worker } from "bullmq";
import { sendEmail } from "./email";
import IORedis from "ioredis";


console.log("Email worker is running and waiting for jobs...");





if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined. Make sure your .env file is loaded correctly.");
}

const connection = new IORedis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false }, // Required for Upstash
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
    console.error("Full Error Details:", err);
});
