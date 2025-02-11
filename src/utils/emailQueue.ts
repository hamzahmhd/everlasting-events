import * as dotenv from "dotenv";

dotenv.config();

import { Queue } from "bullmq";
import IORedis from "ioredis";

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined. Make sure your .env file is loaded correctly.");
}

const connection = new IORedis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false } // Required for Upstash
});

export const emailQueue = new Queue("emailQueue", { connection });
