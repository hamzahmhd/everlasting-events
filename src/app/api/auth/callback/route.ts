import { NextResponse } from "next/server";
import { google } from "googleapis";

if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is not set.");
}

// Load client credentials from environment variable
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
);
const { client_secret, client_id, redirect_uris } = credentials.web;
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Authorization code is missing" }, { status: 400 });
    }

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    console.log("Received Google OAuth tokens:", tokens);

    return NextResponse.json({ message: "Authentication successful!", tokens });
  } catch (error) {
    console.error("Error in callback handler:", error);
    return NextResponse.json({ error: "Failed to handle callback" }, { status: 500 });
  }
}
