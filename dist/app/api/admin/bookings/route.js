"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const client_1 = require("@prisma/client");
const server_1 = require("next/server");
const prisma = new client_1.PrismaClient();
async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            where: { status: "pending" },
            include: { User: true }, // Include user details if needed
        });
        return server_1.NextResponse.json(bookings, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching pending bookings:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
