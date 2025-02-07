import { google } from "googleapis";
import * as readline from "readline"; // Use * as for CommonJS modules
import * as fs from "fs";
import * as path from "path";

// Define the required scope for Google Calendar API
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.join(__dirname, "google-calendar-token.json");

// Load client secrets from the environment or a file
const credentials = JSON.parse(
  fs.readFileSync(path.join(__dirname, "google-credentials.json"), "utf-8")
);

const { client_secret, client_id, redirect_uris } = credentials.web; // Use `web` for web applications
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Function to get an access token
function getAccessToken(): void {
  const rl = readline.createInterface({
    input: process.stdin as NodeJS.ReadableStream, // Explicitly cast stdin
    output: process.stdout as NodeJS.WritableStream, // Explicitly cast stdout
  });

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this URL:", authUrl);

  rl.question("Enter the code from that page here: ", (code: string) => {
    rl.close();

    oauth2Client.getToken(code, (err, token) => {
      if (err || !token) {
        console.error("Error retrieving access token", err);
        return;
      }

      oauth2Client.setCredentials(token);
      console.log("Your Refresh Token:", token.refresh_token);

      // Store the token for future use
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      console.log("Token stored to", TOKEN_PATH);
    });
  });
}

// Execute token generation
getAccessToken();

