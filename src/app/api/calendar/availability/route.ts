import { google } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const TOKEN_PATH = path.join(process.cwd(), "google-calendar-token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "google-credentials.json");

const loadOAuthClient = () => {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oauth2Client.setCredentials(tokens);

  return oauth2Client;
};

export async function GET() {
  try {
    const auth = loadOAuthClient();
    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date().toISOString();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now,
      timeMax: oneMonthLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items?.map((event) => ({
      id: event.id,
      summary: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    }));

    // Force logging even if events are empty
    console.log("---------------");
    console.log("Google Calendar API Response:");
    console.log(events);
    console.log("---------------");

    return NextResponse.json(events || []);
  } catch (error) {
    console.error("Error fetching calendar availability:", error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
