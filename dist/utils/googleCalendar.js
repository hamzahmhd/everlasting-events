"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calendar = void 0;
exports.getAvailableSlots = getAvailableSlots;
const googleapis_1 = require("googleapis");
const auth = new googleapis_1.google.auth.GoogleAuth({
    credentials: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
});
exports.calendar = googleapis_1.google.calendar({ version: "v3", auth });
async function getAvailableSlots() {
    const events = await exports.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        singleEvents: true,
    });
    return events.data.items;
}
