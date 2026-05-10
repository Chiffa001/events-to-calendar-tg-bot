import "dotenv/config";
import * as http from "node:http";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const REDIRECT_PORT = 3000;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}`;

async function main() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Error: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
    process.exit(1);
  }

  const client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log(`\nOpen this URL in your browser:\n\n${authUrl}\n`);
  console.log(`Waiting for OAuth callback on port ${REDIRECT_PORT}...`);

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsed = new URL(req.url ?? "/", `http://localhost:${REDIRECT_PORT}`);
      const code = parsed.searchParams.get("code");
      if (code) {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Авторизация прошла успешно! Можно закрыть эту вкладку.");
        server.close();
        resolve(code);
      }
    });
    server.listen(REDIRECT_PORT);
    setTimeout(() => {
      server.close();
      reject(new Error("OAuth timeout after 60s"));
    }, 60_000);
  });

  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    console.error(
      "\nNo refresh_token returned. Revoke access at https://myaccount.google.com/permissions and try again.",
    );
    process.exit(1);
  }

  console.log(`\nAdd this to your .env:\n\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
}

main().catch(console.error);
