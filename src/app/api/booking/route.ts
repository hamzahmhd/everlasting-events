import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/email"; // Import the email utility

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Parsed Request Body in API:", body);

    // Validate payload
    if (!body || typeof body !== "object") {
      console.error("Invalid payload received:", body);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const {
      eventType,
      eventDate,
      consultationDate,
      location,
      budget,
      description,
      userId,
      phoneNumber, // Include phoneNumber in destructuring
    } = body;

    // Additional Validation
    if (!eventType || !eventDate || !consultationDate || !location || !budget || !userId || !phoneNumber) {
      console.error("Validation Failed. Missing fields:", {
        eventType,
        eventDate,
        consultationDate,
        location,
        budget,
        userId,
        phoneNumber,
      });
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
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
      phoneNumber, // Add phoneNumber to Prisma data
      status: "pending",
    };
    console.log("Prisma Data for Booking Creation:", prismaData);

    // Create booking
    const booking = await prisma.booking.create({
      data: prismaData,
    });

    console.log("Booking created successfully:", booking);

    // Send email to admin
    await sendEmail({
      to: "mail.everlastingevents@gmail.com", // Replace with admin email
      subject: "New Booking Request",
      html: `
        <h1>New Booking Request</h1>
        <p><strong>Event Type:</strong> ${booking.eventType}</p>
        <p><strong>Event Date:</strong> ${booking.eventDate.toLocaleString()}</p>
        <p><strong>Consultation Date:</strong> ${booking.consultationDate.toLocaleString()}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Budget:</strong> $${booking.budget}</p>
        <p><strong>Description:</strong> ${booking.description || "N/A"}</p>
        <p><strong>Phone Number:</strong> ${booking.phoneNumber}</p>
      `,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error in API POST Handler:", error);

    // Return detailed error in dev
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

