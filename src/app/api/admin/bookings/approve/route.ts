import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { emailQueue } from "@/utils/emailQueue";
import { insertConsultationEvent } from "@/utils/googleCalendar";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "approved" },
      include: { User: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Send email notification to the client
    await emailQueue.add("sendEmail", {
      to: booking.User.email,
      subject: "Consultation Confirmed",
      text: `Dear ${booking.User.name},

Your booking for ${booking.eventType} has been approved! 

Here are the details of your consultation:
- Event Type: ${booking.eventType}
- Event Date: ${booking.eventDate.toLocaleString()}
- Consultation Date: ${booking.consultationDate.toLocaleString()}
- Phone Number: ${booking.phoneNumber}

We will call you at the scheduled consultation time to discuss your event.

Thank you for choosing Everlasting Events!

Best regards,
Everlasting Events`,
      html: `
        <p>Dear ${booking.User.name},</p>
        <p>Your booking for <strong>${booking.eventType}</strong> has been approved!</p>
        <p>Here are the details of your consultation:</p>
        <ul>
          <li><strong>Event Type:</strong> ${booking.eventType}</li>
          <li><strong>Event Date:</strong> ${booking.eventDate.toLocaleString()}</li>
          <li><strong>Consultation Date:</strong> ${booking.consultationDate.toLocaleString()}</li>
          <li><strong>Phone Number:</strong> ${booking.phoneNumber}</li>
        </ul>
        <p>We will call you at the scheduled consultation time to discuss your event.</p>
        <p>Thank you for choosing Everlasting Events!</p>
        <p>Best regards,<br>Everlasting Events</p>
      `,
    });

    // Create a consultation event in Google Calendar
    try {
      await insertConsultationEvent("mail.everlastingevents@gmail.com", {
        summary: `Consultation with ${booking.User.name}`,
        description: `Discussing ${booking.eventType}. Phone: ${booking.phoneNumber}`,
        start: booking.consultationDate.toISOString(),
        end: new Date(new Date(booking.consultationDate).getTime() + 30 * 60 * 1000).toISOString(),
      });
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
    }

    return NextResponse.json({ message: "Booking approved successfully" });
  } catch (error) {
    console.error("Error approving booking:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
