"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const client_1 = require("@prisma/client");
const server_1 = require("next/server");
const email_1 = require("@/utils/email"); // Import the email utility
const prisma = new client_1.PrismaClient();
async function POST(req) {
    try {
        const body = await req.json();
        console.log("Parsed Request Body in API:", body);
        // Validate payload
        if (!body || typeof body !== "object") {
            console.error("Invalid payload received:", body);
            return server_1.NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        const { eventType, eventDate, consultationDate, location, budget, description, userId } = body;
        // Additional Validation
        if (!eventType || !eventDate || !consultationDate || !location || !budget || !userId) {
            console.error("Validation Failed. Missing fields:", {
                eventType,
                eventDate,
                consultationDate,
                location,
                budget,
                userId,
            });
            return server_1.NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
        }
        // Log Prisma data before creating the booking
        const prismaData = {
            eventType,
            eventDate: new Date(eventDate),
            consultationDate: new Date(consultationDate),
            location,
            budget,
            description,
            userId,
            status: "pending",
        };
        console.log("Prisma Data for Booking Creation:", prismaData);
        // Create booking
        const booking = await prisma.booking.create({
            data: prismaData,
        });
        console.log("Booking created successfully:", booking);
        // Send email to admin
        await (0, email_1.sendEmail)({
            to: "mail.everlastingevents@gmail.com", // Replace with admin email
            subject: "New Booking Request",
            html: `
        <h1>New Booking Request</h1>
        <p><strong>Event Type:</strong> ${booking.eventType}</p>
        <p><strong>Event Date:</strong> ${booking.eventDate.toLocaleString()}</p>
        <p><strong>Consultation Date:</strong> ${booking.consultationDate.toLocaleString()}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Budget:</strong> $${booking.budget}</p>
        <p><strong>Description:</strong> ${booking.description}</p>
      `,
        });
        return server_1.NextResponse.json(booking, { status: 201 });
    }
    catch (error) {
        console.error("Error in API POST Handler:", error);
        // Return detailed error in dev
        if (process.env.NODE_ENV === "development" && error instanceof Error) {
            return server_1.NextResponse.json({ error: error.message }, { status: 500 });
        }
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
