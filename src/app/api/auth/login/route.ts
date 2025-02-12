import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("Received login request");

    // Parse request body
    const { email, password } = await req.json();
    console.log("Email received:", email);

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error("User not found for email:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    console.log("User found:", user.email);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password attempt for email:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    console.log("Password verification passed");

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in environment variables");
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Create a JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("JWT token generated successfully");

    // Return success response with token
    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Unexpected error in login route:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

