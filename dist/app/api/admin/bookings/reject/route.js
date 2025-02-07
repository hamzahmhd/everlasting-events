"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const client_1 = require("@prisma/client");
const server_1 = require("next/server");
const emailQueue_1 = require("@/utils/emailQueue");
const prisma = new client_1.PrismaClient();
async function POST(req) {
    try {
        const { bookingId, reason } = await req.json();
        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "rejected", reason },
            include: { User: true }, // Include the user details
        });
        if (!booking) {
            return server_1.NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        // Add an email job to the queue
        await emailQueue_1.emailQueue.add("sendEmail", {
            to: booking.User.email,
            subject: "Booking Rejected",
            text: `Dear ${booking.User.name},\n\nUnfortunately, your booking (ID: ${booking.id}) for ${booking.eventType} has been rejected.\n\nReason: ${reason}`,
            html: `
        <h1>Booking Rejected</h1>
        <p>Dear ${booking.User.name},</p>
        <p>Unfortunately, your booking (ID: ${booking.id}) for <strong>${booking.eventType}</strong> has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Thank you for understanding.</p>
        <p>Best regards,<br>Everlasting Events</p>
      `,
        });
        return server_1.NextResponse.json({ message: "Booking rejected successfully" });
    }
    catch (error) {
        console.error("Error rejecting booking:", error);
        return server_1.NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
