import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log("Received login request"); // Log start of request

    // Parse request body
    const { email, password } = await req.json();
    console.log("Parsed request body:", { email });

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    console.log("User found, verifying password...");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password incorrect for email:", email);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create a JWT
    console.log("Generating JWT token...");
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    console.log("Login successful, returning token");
    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login API Error:", error); // Log full error
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
