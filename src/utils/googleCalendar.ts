import { google } from "googleapis";

if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is not set.");
}

// Load Google API credentials from environment variable
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
);

const auth = new google.auth.JWT(
  credentials.client_email,
  undefined,
  credentials.private_key.replace(/\\n/g, "\n"), // Fixes newline formatting issue
  ["https://www.googleapis.com/auth/calendar"]
);

const calendar = google.calendar({ version: "v3", auth });

export async function insertConsultationEvent(
  calendarId: string,
  eventDetails: { summary: string; description: string; start: string; end: string }
) {
  try {
    const event = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: { dateTime: eventDetails.start, timeZone: "America/New_York" },
      end: { dateTime: eventDetails.end, timeZone: "America/New_York" },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log("Google Calendar event created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error inserting event into Google Calendar:", error);
    throw new Error("Failed to insert event into Google Calendar.");
  }
}
