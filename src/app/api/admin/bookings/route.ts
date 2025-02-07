import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch bookings with user details
    const bookings = await prisma.booking.findMany({
      where: { status: "pending" },
      include: { User: true }, // Include the related User details
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
