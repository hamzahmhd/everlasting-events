"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function handler(req, res) {
    if (req.method !== "PATCH")
        return res.status(405).end();
    const { bookingId, status, reason } = req.body;
    try {
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status, reason },
        });
        res.status(200).json({ message: "Booking updated successfully", booking });
    }
    catch (error) {
        if (error instanceof Error) {
            // Type assertion to ensure error has a 'message' property
            res.status(500).json({ error: "Failed to update booking", details: error.message });
        }
        else {
            res.status(500).json({ error: "Unknown error occurred" });
        }
    }
}
