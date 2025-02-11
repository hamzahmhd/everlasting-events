"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = void 0;
var dotenv = require("dotenv");
dotenv.config();
var bullmq_1 = require("bullmq");
var ioredis_1 = require("ioredis");
if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not defined. Make sure your .env file is loaded correctly.");
}
var connection = new ioredis_1.default(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false } // Required for Upstash
});
exports.emailQueue = new bullmq_1.Queue("emailQueue", { connection: connection });
