import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "google-calendar-token.json");

// Load client credentials
const credentials = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "google-credentials.json"), "utf-8")
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

    // Save the tokens for future use
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log("Token stored to", TOKEN_PATH);

    return NextResponse.json({ message: "Authentication successful! Tokens stored." });
  } catch (error) {
    console.error("Error in callback handler:", error);
    return NextResponse.json({ error: "Failed to handle callback" }, { status: 500 });
  }
}
