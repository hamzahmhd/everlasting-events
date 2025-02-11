import { google } from "googleapis";
import fs from "fs";
import * as path from "path";

// Paths for token and credentials
const TOKEN_PATH = path.join(process.cwd(), "google-calendar-token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "google-credentials.json");

// Initialize OAuth2 Client
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_secret, client_id, redirect_uris } = credentials.web;
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
oauth2Client.setCredentials(tokens);

// Function to insert a consultation event
export async function insertConsultationEvent(calendarId: string, eventDetails: {
  summary: string;
  description: string;
  start: string; // ISO 8601 format
  end: string; // ISO 8601 format
}) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const event = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.start,
      timeZone: "America/Toronto", // Adjust time zone as needed
    },
    end: {
      dateTime: eventDetails.end,
      timeZone: "America/Toronto", // Adjust time zone as needed
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
}
