import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const requests = await prisma.booking.findMany({
    include: { User: true },
    orderBy: { consultationDate: "asc" },
  });

  res.status(200).json(requests);
}
