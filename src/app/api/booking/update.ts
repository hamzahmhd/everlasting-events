import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") return res.status(405).end();

  const { bookingId, status, reason } = req.body;

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status, reason },
    });

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    if (error instanceof Error) {
      // Type assertion to ensure error has a 'message' property
      res.status(500).json({ error: "Failed to update booking", details: error.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
}
