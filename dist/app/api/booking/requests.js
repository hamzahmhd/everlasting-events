"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function handler(req, res) {
    if (req.method !== "GET")
        return res.status(405).end();
    const requests = await prisma.booking.findMany({
        include: { User: true },
        orderBy: { consultationDate: "asc" },
    });
    res.status(200).json(requests);
}
