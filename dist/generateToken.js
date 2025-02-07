"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var googleapis_1 = require("googleapis");
var readline = require("readline"); // Use * as for CommonJS modules
var fs = require("fs");
var path = require("path");
// Define the required scope for Google Calendar API
var SCOPES = ["https://www.googleapis.com/auth/calendar"];
var TOKEN_PATH = path.join(__dirname, "google-calendar-token.json");
// Load client secrets from the environment or a file
var credentials = JSON.parse(fs.readFileSync(path.join(__dirname, "google-credentials.json"), "utf-8"));
var _a = credentials.web, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris; // Use `web` for web applications
var oauth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// Function to get an access token
function getAccessToken() {
    var rl = readline.createInterface({
        input: process.stdin, // Explicitly cast stdin
        output: process.stdout, // Explicitly cast stdout
    });
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:", authUrl);
    rl.question("Enter the code from that page here: ", function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
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
