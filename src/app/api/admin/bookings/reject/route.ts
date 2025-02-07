import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { emailQueue } from "@/utils/emailQueue";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { bookingId, reason } = await req.json();

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "rejected", reason },
      include: { User: true }, // Include the user details
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Add an email job to the queue
    await emailQueue.add("sendEmail", {
      to: booking.User.email,
      subject: "Booking Rejected",
      text: `Dear ${booking.User.name},\n\nUnfortunately, your booking for ${booking.eventType} has been rejected.\n\nReason: ${reason}`,
      html: `
        <p>Dear ${booking.User.name},</p>
        <p>Unfortunately, your booking for <strong>${booking.eventType}</strong> has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Thank you for understanding.</p>
        <p>Best regards,<br>Everlasting Events</p>
      `,
    });

    return NextResponse.json({ message: "Booking rejected successfully" });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

