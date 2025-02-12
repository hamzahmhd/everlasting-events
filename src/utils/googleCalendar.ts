import { google } from "googleapis";

if (!process.env.GOOGLE_CREDENTIALS) {
  throw new Error("GOOGLE_CREDENTIALS environment variable is not set.");
}

if (!process.env.GOOGLE_CALENDAR_TOKEN) {
  throw new Error("GOOGLE_CALENDAR_TOKEN environment variable is not set.");
}

// Decode and parse credentials
const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
);

// Decode and parse token
const tokens = JSON.parse(
  Buffer.from(process.env.GOOGLE_CALENDAR_TOKEN, "base64").toString("utf-8")
);

const auth = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

// Set the credentials
auth.setCredentials(tokens);

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
